import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleType} from '../../../types/article.type';
import {environment} from '../../../environments/environment';
import {DefaultResponseType} from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  articlesPath: string = `${environment.api}articles/`;

  constructor(private readonly http: HttpClient) { }

  public getPopularArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(this.articlesPath + "top");
  }

}
