import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleType} from '../../../types/article/article.type';
import {environment} from '../../../environments/environment';
import {DefaultResponseType} from '../../../types/default-response.type';
import {ArticlesPackType} from '../../../types/article/articles-pack.type';
import {ActiveQueryParamsType} from '../../../types/active-query-params.type';
import {ArticleDetailsType} from '../../../types/article/article-details.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  articlesPath: string = `${environment.api}${environment.apiPath.articles}`;

  relatedArticlesPath: string = `${environment.api}${environment.apiPath.relatedArticles}`;

  constructor(private readonly http: HttpClient) { }

 // Запрос на получение популярных статей. В ответ получаем 4 самые популярные статьи
  public getPopularArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(this.articlesPath + "/top");
  }

  // Запрос на получение всех статей. В параметрах можно передавать категории а также страницу пагинации.
  // Возвращает количество всех статей, количество страниц, а также массив статей.
  public getArticles(params: ActiveQueryParamsType): Observable<ArticlesPackType | DefaultResponseType> {
    const httpParams = new HttpParams({ fromObject: params });

    return this.http.get<ArticlesPackType | DefaultResponseType>(this.articlesPath, { params: httpParams });
  }

  // Запрос на получение детальной информации по статье
  public getDetailsArticle(url:string): Observable<ArticleDetailsType | DefaultResponseType> {
    return this.http.get<ArticleDetailsType | DefaultResponseType>(this.articlesPath + `/${url}`);
  }

  //Запрос на получение связанных статей для определенной статьи. В ответ получаем 2 статьи
  public getRelatedArticles(url:string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(this.relatedArticlesPath + `/${url}`);
  }

}
