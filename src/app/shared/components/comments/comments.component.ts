import {Component, Input, OnInit} from '@angular/core';
import {CommentsService} from '../../services/comments.service';
import {CommentsPackType} from '../../../../types/article/comment.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {finalize} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{

  //получаем id статьи
  @Input()articleId: string = '';

  private quantityComment: number = 3;

  //комментрарии статьи
  comments: CommentsPackType = {  allCount: 0, comments: []};

  // кол-во получаемых комментариев
  commentForm!: FormGroup;

  constructor(private commentsService: CommentsService,
              private readonly fb: FormBuilder,
              readonly authService: AuthService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit() {

    this.initCommentForm(this.articleId);

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

    //query-параметры для запроса за коментариями(offset: -колво комментариев, article: -id статьи получаемых комментов)
    const params: {offset: number, article: string} = {offset: this.quantityComment, article: this.articleId, }

    this.commentsService.getComments(params).subscribe({

      next: (dataComments: CommentsPackType | DefaultResponseType) => {
        if ((dataComments as DefaultResponseType).error) {
          throw new Error((dataComments as DefaultResponseType).message);
        }

        this.comments = dataComments as CommentsPackType;

        console.log(this.comments);

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

      finalize(()=> {
        //очищаем поле комментария после отправки запроса
        this.commentForm.get('text')?.setValue('');
      })

    ).subscribe({

      next: (DefaultResponse: DefaultResponseType) => {

        if(DefaultResponse.error) {
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

}
