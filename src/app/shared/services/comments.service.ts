import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommentsPackType} from '../../../types/comment/comment.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {CommentApplyActionEnum} from '../../../enum/comment-apply-action.enum';
import {CommentActionUserType} from '../../../types/comment/comment-action-user.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private readonly http: HttpClient) {}

  commentsPath: string = `${environment.api}${environment.apiPath.comments}`;


  // Запрос на загрузку комментариев к статье. Передаем количество комментариев, которые надо получить, а также id статьи
  public getComments(params: {offset?: number, article: string}): Observable<CommentsPackType | DefaultResponseType> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<CommentsPackType | DefaultResponseType>(this.commentsPath, {params: httpParams});
  }


  //Запрос на добавление нового комментария. Необходимо передавать авторизационный заголовок с access токеном. В ответ получаем DefaultResponse
  public createComment(body: {text: string, article: string}): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(this.commentsPath, body);
  }


  //Запрос на применение действия для комментария. Возможные варианты для action в body: like, dislike, violate
  // Необходимо передавать авторизационный заголовок с access токеном. В ответ получаем DefaultResponse
  public applyActionComment(commentId: string, body: {action: CommentApplyActionEnum}): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${this.commentsPath}/${commentId}/apply-action`, body);
  }


  // Запрос на получение реакции пользователя на комментарий.
  // Необходимо передавать авторизационный заголовок с access токеном.
  // В ответ получаем DefaultResponse в случае неудачи, либо же массив действий пользователя (кроме violate)
  public getActionUserComment(commentId: string): Observable<CommentActionUserType[] | DefaultResponseType> {
    return this.http.get<CommentActionUserType[] | DefaultResponseType>(`${this.commentsPath}/${commentId}/actions`);
  }


  // Запрос на получение действий пользователя для всех комментариев в рамках одной статьи. (кроме реакции violate - жалоба)
  public getActionUserAllComment(articleId: string): Observable<CommentActionUserType[] | DefaultResponseType> {
    return this.http.get<CommentActionUserType[] | DefaultResponseType>(`${this.commentsPath}/article-comment-actions?articleId=${articleId}`);
  }

}
