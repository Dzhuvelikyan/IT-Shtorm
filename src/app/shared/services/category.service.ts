import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleType} from '../../../types/article/article.type';
import {environment} from '../../../environments/environment';
import {DefaultResponseType} from '../../../types/default-response.type';
import {CategoryType} from '../../../types/category.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoriesPath: string = `${environment.api}${environment.apiPath.categories}`;

  constructor(private readonly http: HttpClient) { }

  // получение категории статей для фильтра
  public getCategories(): Observable<CategoryType[] | DefaultResponseType> {
    return this.http.get<CategoryType[] | DefaultResponseType>(this.categoriesPath);
  }

}
