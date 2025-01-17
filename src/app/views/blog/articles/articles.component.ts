import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../../shared/services/article.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {ArticlesPackType} from '../../../../types/article/articles-pack.type';
import {ActiveQueryParamsType} from '../../../../types/active-query-params.type';
import {environment} from '../../../../environments/environment';
import {ActiveQueryParamsUtil} from '../../../shared/utils/active-query-params.util';
import {scaleAnimation} from '../../../shared/utils/animations.util';
import {finalize, Subject, takeUntil, tap} from 'rxjs';
import {LoaderService} from '../../../shared/services/loader.service';

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  animations: [scaleAnimation],
})
export class ArticlesComponent implements OnInit, OnDestroy {

  private readonly articleApiPath: string = '';

  //для хранение активных query-параметров для фильтрации товаров через запрос на бэк(ставим дефолтные значения-необязательно)
  public activeQueryParams: ActiveQueryParamsType = {page: 1, categories: []};

  //группа статей одной страницы получаем с бэка
  public packArticles: ArticlesPackType = {} as ArticlesPackType;

  //кол-во страниц получаем с бэка и выводим на страницу пагинацией
  pages: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly articleService: ArticleService,
              private readonly loaderService: LoaderService,) {

    //путь для запроса статей
    this.articleApiPath = environment.apiPath.articles;

  }

  ngOnInit() {
    //получение статей для одной страницы в зависиммости от переданных query-параметров(фильтров)
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
      tap(()=> this.loaderService.show())
    )
      .subscribe((params) => {
      this.activeQueryParams = ActiveQueryParamsUtil.process(params);

      //получение статей одной страницы(если в this.activeQueryParams нет параметров получаем статьи для первой страницы без фильтров)
      this.articleService.getArticles(this.activeQueryParams).pipe(
        takeUntil(this.destroy$),
        finalize(()=> this.loaderService.hide())
      )
        .subscribe({

        next: (data: ArticlesPackType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.packArticles = data as ArticlesPackType;

          this.renderView();

        },
        error: (error: HttpErrorResponse) => {
          throw new Error("Произошла ошибка при запросе на серевер");
        }
      });

    });

  }

  //отрисовка состояния страницы (перерисовка страницы с новвыми данными)
  private renderView(): void {

    //перерисовываеи кол-во страниц в пагинации
    this.pages = [];//очищаем массив что-бы страницы не дублировались
    for (let i = 1; i <= this.packArticles.pages; i++) {
      this.pages.push(i);//заполняем массив(кол-во страниц)
    }

  }

  //методы для пагинации страниц
  public openPage(page: number): void {
    this.activeQueryParams.page = page;
    this.router.navigate([this.articleApiPath], {queryParams: this.activeQueryParams});
  }
  public openPrevPage(): void {
    if (this.activeQueryParams.page && this.activeQueryParams.page > 1) {
      this.activeQueryParams.page--;
      this.router.navigate([this.articleApiPath], {queryParams: this.activeQueryParams});
    }
  }
  public openNextPage(): void {

    if (!this.activeQueryParams.page) {
      this.activeQueryParams.page = 1;
    }

    if (this.activeQueryParams.page < this.pages.length) {
      this.activeQueryParams.page++;
      this.router.navigate([this.articleApiPath], {queryParams: this.activeQueryParams});
    }

  }

  // удаление примененного фильтра
  public removeAppliedFilter(categoryFilter: string): void {
    if(this.activeQueryParams.categories) {
      this.activeQueryParams.categories = this.activeQueryParams.categories.filter(category => category !== categoryFilter);
    }
    this.router.navigate([this.articleApiPath], {queryParams: this.activeQueryParams});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
