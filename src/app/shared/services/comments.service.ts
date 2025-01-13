import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommentsPackType} from '../../../types/article/comment.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private readonly http: HttpClient) {}

  commentsPath: string = `${environment.api}${environment.apiPath.comments}`;

  // Запрос на загрузку комментариев к статье. Передаем количество комментариев, которые надо получить, а также id статьи
  public getComments(params: {offset: number, article: string}): Observable<CommentsPackType | DefaultResponseType> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<CommentsPackType | DefaultResponseType>(this.commentsPath, {params: httpParams});
  }

  //Запрос на добавление нового комментария. Необходимо передавать авторизационный заголовок с access токеном. В ответ получаем DefaultResponse
  public createComment(body: {text: string, article: string}): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(this.commentsPath, body);
  }
}
