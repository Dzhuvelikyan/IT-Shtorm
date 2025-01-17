import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommentType} from '../../../../types/comment/comment.type';
import {CommentsService} from '../../services/comments.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentApplyActionEnum} from '../../../../enum/comment-apply-action.enum';
import {CommentActionUserType} from '../../../../types/comment/comment-action-user.type';
import {Subject, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-comment-card',
  standalone: false,
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent implements OnInit, OnDestroy {

  // данные для карточки комментария полученные от родителя
  @Input() comment: CommentType;

  //оповещаем родителя о том что пользователь отреагировал на комент, чтобы отрисовать комменты с примененной реакцией
  @Output() userAppliedAction = new EventEmitter<void>();
  private handleAppliedAction(): void {
    // Уведомляем родителя о событии(реакция на коммент)
    this.userAppliedAction.emit();
  }

  public commentActionEnum = CommentApplyActionEnum;

  // действия пользователя для комментария
  public actionUserComment: CommentActionUserType = {} as CommentActionUserType;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly commentService: CommentsService,
              private readonly _snackBar: MatSnackBar,
              private readonly authService: AuthService,) {

    this.comment = {
      id: "0",
      text: "Интересно, это было экспертное мнение или личный опыт автора?",
      date: "21.01.2023 03:22",
      likesCount: 12,
      dislikesCount: 5,
      user: {
        id: "0",
        name: "Влад"
      }
    }

  }

  ngOnInit(): void {

    this.getActionUserComment();

  }

  // вызывает запрос на создание действия к коментарию
  private createActionComment(action: CommentApplyActionEnum): void {

    //сообщение для вывода пользователю
    let message: string = "";

    // запрос
    this.commentService.applyActionComment(this.comment.id, {action}).pipe(
      takeUntil(this.destroy$),
      tap(() => {
        if (action === CommentApplyActionEnum.like || action === CommentApplyActionEnum.dislike) {
          message = "Ваш голос учтен."
        } else if (action === CommentApplyActionEnum.violate) {
          message = "Жалоба отправлена."
        }
      })
    ).subscribe({

        next: (data: DefaultResponseType): void => {
          if (data.error) {
            this._snackBar.open(data.message);
          }

          this._snackBar.open(message);

          //оповещаем родителя для перерисовки
          this.handleAppliedAction();
        },

        error: (error) => {
          console.error(error.error.message);
          this._snackBar.open("Жалоба уже отправлена.");
        },

      });

  }

  // получаем значение действия к коментарию по клику (лайк дизлайк жалоба) для отправки запроса
  // Обработчик события
  public applyActionClick(eve: MouseEvent): void {

    //если не авторизован выводим сбщ
    if (!this.authService.getLoggedIn()) {
      this._snackBar.open("Для этого действия необходимо авторизоваться.");
      return
    }

    const target: HTMLButtonElement = eve.target as HTMLButtonElement;

    if (target.getAttribute("data-action-type")) {

      // пполученное действие (лайк дизлайк жалоба)
      const action: CommentApplyActionEnum = target.getAttribute("data-action-type") as CommentApplyActionEnum;

      // запрос на создание действие к коментарию
      this.createActionComment(action);

    }

  }

  // вызывает запрос на получение реакции пользователя на комментарий.
  private getActionUserComment(): void {
    if (!this.authService.getLoggedIn()) return;

    // Запрос на получение реакции пользователя на комментарий.
    this.commentService.getActionUserComment(this.comment.id).pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (data: CommentActionUserType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.actionUserComment = (data as CommentActionUserType[])[0];
      },

      error: (error: HttpErrorResponse) => {
        throw new Error(error.error.message);
      }

    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
