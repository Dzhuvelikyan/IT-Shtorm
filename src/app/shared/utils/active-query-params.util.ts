import {Params} from "@angular/router";
import {ActiveQueryParamsType} from "../../../types/active-query-params.type";
import {ArticleQueryParamsEnum} from '../../../enum/article-query-params.enum';

export class ActiveQueryParamsUtil {

  //формирование квери-параметров для фильтрации статей
  static process(params: Params): ActiveQueryParamsType {

    const activeParams: ActiveQueryParamsType = {
      categories: Array.isArray(params[ArticleQueryParamsEnum.categories]) ? params[ArticleQueryParamsEnum.categories] : []
    };

    // если в params[ArticleQueryParamsEnum.categories] строка, преобразуем в массив со строкой
    if (params.hasOwnProperty(ArticleQueryParamsEnum.categories)) {
      activeParams.categories = (Array.isArray(params[ArticleQueryParamsEnum.categories]))? params[ArticleQueryParamsEnum.categories]: [ params[ArticleQueryParamsEnum.categories] ];
    }

    if (params.hasOwnProperty(ArticleQueryParamsEnum.page)) {
      activeParams.page = +params[ArticleQueryParamsEnum.page];
    }

    return activeParams;

  }
}
