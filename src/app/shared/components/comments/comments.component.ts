import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommentsService} from '../../services/comments.service';
import {CommentsPackType, CommentType} from '../../../../types/comment/comment.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from '../../services/loader.service';
import {CommentActionUserType} from '../../../../types/comment/comment-action-user.type';

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnChanges, OnInit, OnDestroy {

  //получаем id статьи(от родительского компонента)
  @Input() articleId: string = '';

  // комментарии к статье (первые 3 полученные со статьёй)
  @Input() comments: CommentType[] = [];

  // всего комментариев у статьи на бэкенде (полученные со статьей)
  @Input() allCountComments: number = 0;

  //оповещаем родителя о том что пользователь отреагировал на комент, чтобы отрисовать комменты с примененной реакцией
  @Output() userAddComment = new EventEmitter<void>();
  private handleUerAddComment(): void {
    // Уведомляем родителя о добавлении комментария
    this.userAddComment.emit();
  }

  public commentForm!: FormGroup;

  // первоначальное кол-во полученных комментариев
  private offset: number = 3;

  // максимальное число подгружаемых комментариев
  private maxLoadedComment: number = 10;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private commentsService: CommentsService,
              private readonly fb: FormBuilder,
              readonly authService: AuthService,
              private _snackBar: MatSnackBar,
              private readonly loaderService: LoaderService,) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleId']) {
      this.offset = 3;
      this.processComment();
      this.showBtnMoreComments();
    }
  }

  ngOnInit(): void {

    this.initCommentForm(this.articleId);

  }

  // добавляем к коментарию свойство с реакцией пользователя на комментарий
  private processComment(): void {
    if (this.authService.getLoggedIn()) {
      this.commentsService.getActionUserAllComment(this.articleId)
        .subscribe({
          next: (data: CommentActionUserType[] | DefaultResponseType) => {
            if((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message)
            }

            const result: CommentActionUserType[] = (data as CommentActionUserType[]);
            if (result.length > 0) {
              result.forEach(item => {
                this.comments.map(comment => {
                  if (comment.id === item.comment) {
                    comment.userAction = item.action;
                  }
                })
              })
            }

          },

          error: error => {
            throw new HttpErrorResponse(error.error.message);
          }
        })
    }
  }

  // инициализируем FormGroup для комментария
  private initCommentForm(articleId: string = ''): void {
    this.commentForm = this.fb.group({
      article: [articleId],
      text: ['', Validators.required],
    });
  }

  // Запрос на получение коментариев для статьи.
  public loadMoreComments(): void {
    this.commentsService.getComments({offset: this.offset, article: this.articleId}).pipe(
      takeUntil(this.destroy$),
      finalize(()=> this.loaderService.hide()))
      .subscribe({

        next: (dataComments: CommentsPackType | DefaultResponseType) => {
          this.loaderService.show();

          if ((dataComments as DefaultResponseType).error) {
            throw new Error((dataComments as DefaultResponseType).message);
          }
          const data: CommentsPackType = (dataComments as CommentsPackType);
          this.allCountComments = data.allCount;

          // добавляем полученные доп. коменты в массив к остальным
          this.comments = this.comments.concat(data.comments);
          this.processComment();

          // формируем offset для получения след. дополнительных комментариев
          if (this.comments.length < this.allCountComments &&
            this.offset + this.maxLoadedComment < this.allCountComments) {
            this.offset += this.maxLoadedComment;
          } else {
            this.offset = this.allCountComments;
          }

        },

        error: () => {
          throw new Error("Не удалось получить комментарии к статье");
        }

      });

  }

  // Запрос на добавление нового комментария к статье.
  public createComment() {
    if (this.commentForm.invalid) return;

    this.commentsService.createComment(this.commentForm.value).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        //очищаем поле комментария после отправки запроса
        this.commentForm.get('text')?.setValue('');
      })
    ).subscribe({

      next: (DefaultResponse: DefaultResponseType) => {

        if (DefaultResponse.error) {
          this._snackBar.open("Комментарий не добавлен, из за ошибка авторизации.");
          throw new Error(DefaultResponse.message);
        }

        // информируем пользователя о том что Комментарий добавлен успешно
        this._snackBar.open(DefaultResponse.message);

        // оповещаем родителя для перерисовки компонента(что-бы отобразить добавленный коментарий)
        this.handleUerAddComment()

      },

      error: (error: HttpErrorResponse) => {
        this._snackBar.open("Комментарий не добавлен, из за ошибка авторизации.");
        console.error(error.error.message);
      }

    });

  }

  public showBtnMoreComments(): boolean {
    return this.allCountComments > this.offset && this.allCountComments > this.comments.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete();
  }

}
