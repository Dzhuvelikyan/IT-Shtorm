import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CommentsService} from '../../services/comments.service';
import {CommentsPackType} from '../../../../types/comment/comment.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnChanges, OnInit, OnDestroy {

  //получаем id статьи(от родительского компонента)
  @Input() articleId: string = '';

  public commentForm!: FormGroup;

  //комментрарии статьи
  public comments: CommentsPackType = {allCount: 0, comments: []};

  // первоначальное кол-во получаемых комментариев
  public quantityCommentDefault: number = 3;

  // максимальное количество комментов подгружаемых из бэкенда за раз
  public loadedQuantityComment: number = 10;

  //отправляемое число на бэк должно быть отрицательное. пример: отправляем -7, получаем 3 последних комментария
  private currentQuantity: number = 0 - (this.loadedQuantityComment - this.quantityCommentDefault);

  //query-параметры для запроса за коментариями(offset: вычисляемое колво комментариев, article: id статьи)
  private params: { offset: number, article: string } = {offset: 0, article: "",}

  destroy$: Subject<void> = new Subject<void>();

  constructor(private commentsService: CommentsService,
              private readonly fb: FormBuilder,
              readonly authService: AuthService,
              private _snackBar: MatSnackBar,
              private readonly loaderService: LoaderService,) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleId']) {

      //отрисовываем компонент с комментариями
      this.renderCommentsComponent();

    }
  }

  ngOnInit(): void {

    this.initCommentForm(this.articleId);

  }

  // отрисовка компонента при изменениях articleId
  private renderCommentsComponent(): void {
    //формируем query-параметры для запроса за коментариями
    this.params = {offset: this.currentQuantity, article: this.articleId,}

    this.loadComments();

  }

  // инициализируем FormGroup для комментария
  private initCommentForm(articleId: string = ''): void {
    this.commentForm = this.fb.group({
      article: [articleId],
      text: ['', Validators.required],
    });
  }

  // Запрос на получение коментариев для статьи.
  private loadComments(): void {
    this.commentsService.getComments(this.params).pipe(
      takeUntil(this.destroy$),
      finalize(()=> this.loaderService.hide()))
      .subscribe({

      next: (dataComments: CommentsPackType | DefaultResponseType) => {
        if ((dataComments as DefaultResponseType).error) {
          throw new Error((dataComments as DefaultResponseType).message);
        }

        this.comments = dataComments as CommentsPackType;
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

        // загрузаем обновленный список комментариев
        this.loadComments();

      },

      error: (error: HttpErrorResponse) => {
        this._snackBar.open("Комментарий не добавлен, из за ошибка авторизации.");
        console.error(error.error.message);
      }

    });

  }

  // загрузить еще комменты по клику
  public loadMoreCommentsClick(): void {

    this.loaderService.show();

    //формируем query-параметры для запроса
    this.params = {offset: 0, article: this.articleId,}

    // загружаем комменты и отключaем лоадера
    this.loadComments()

  }

  // действие на реакцию пользователя к комментарию в дочернем компоненте "comment-card"
  public appliedUserActionComment(): void {

    //отрисовываем компонент с комментариями
     this.loadComments();

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete();
  }

}
