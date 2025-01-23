import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommentType} from '../../../../types/comment/comment.type';
import {CommentsService} from '../../services/comments.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentApplyActionEnum} from '../../../../enum/comment-apply-action.enum';
import {Subject, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-comment-card',
  standalone: false,
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent implements OnInit, OnDestroy {

  // данные для карточки комментария полученные от родителя
  @Input() comment: CommentType;

  public commentActionEnum = CommentApplyActionEnum;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly commentService: CommentsService,
              private readonly _snackBar: MatSnackBar,
              private readonly authService: AuthService,) {

    this.comment = {
      id: "0",
      text: "Интересно, это было экспертное мнение или личный опыт автора?",
      date: "21.01.2023 03:22",
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: "0",
        name: "Влад"
      },
      userAction: ""
    }

  }

  ngOnInit(): void {


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

        // обрабатываем действия порльзователя
        this.processUserActions(action);

        this._snackBar.open(message);
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

  // обработка действий пользователя на комментарий
  private processUserActions(action: CommentApplyActionEnum): void {

    // если реакция "жалоба" не обрабатываем действия
    if (action === CommentApplyActionEnum.violate) return

    if (!this.comment.userAction) {
      // Если пользователь еще не взаимодействовал
      if (action === CommentApplyActionEnum.like) this.comment.likesCount++;
      if (action === CommentApplyActionEnum.dislike) this.comment.dislikesCount++;
      this.comment.userAction = action;
    } else {
      if (action !== this.comment.userAction) {
        // если пользователь меняет действие
        if (action === CommentApplyActionEnum.like) {
          this.comment.likesCount++;
          this.comment.dislikesCount--;
        } else if (action === CommentApplyActionEnum.dislike) {
          this.comment.likesCount--;
          this.comment.dislikesCount++;
        }
        this.comment.userAction = action;
      } else {
        //если пользователь отменяет действие
        if (action === CommentApplyActionEnum.like) {
          this.comment.likesCount--;
        } else if (action === CommentApplyActionEnum.dislike) {
          this.comment.dislikesCount--;
        }
        this.comment.userAction = ""; //сбрасываем действие (комент без реакции)
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
