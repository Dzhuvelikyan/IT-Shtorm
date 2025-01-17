import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveQueryParamsType} from '../../../../types/active-query-params.type';
import {ActiveQueryParamsUtil} from '../../utils/active-query-params.util';
import {CategoryService} from '../../services/category.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {CategoryType} from '../../../../types/category.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-filter-select',
  standalone: false,
  templateUrl: './filter-select.component.html',
  styleUrl: './filter-select.component.scss'
})
export class FilterSelectComponent implements OnInit, OnDestroy {

  activeQueryParams: ActiveQueryParamsType = {page: 1, categories: []};

  filterOpened: boolean = false;

  filterOption: CategoryType[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly categoryService: CategoryService,) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe(params => {

      //сохраняем query-параметры в activeQueryParams
      this.activeQueryParams = ActiveQueryParamsUtil.process(params);

    });

    this.categoryService.getCategories().pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (data: CategoryType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.filterOption = data as CategoryType[];

      },

      error: () => {
        throw new Error("Произошла ошибка при запросе категорий статей для фильтра.");
      }

    })

  }

  // открыть, закрыть фильтр
  public toggleOpenFilter(): void {
    this.filterOpened = !this.filterOpened;
  }

  // фильтрация(обработчик по клику на элемент фильтра)
  public filtration(value: string): void {

    if (this.activeQueryParams.categories) {

      //добавляем в query-параметры категорюю фильтра если такой там нет и удаляем если такая есть
      if (!this.activeQueryParams.categories.includes(value)) {

        // this.activeQueryParams.categories.push(value);
        // push почему то работает не корректно(фильтр срабатывает со второго раза)
        this.activeQueryParams.categories = [...this.activeQueryParams.categories, value];

      } else {
        //удаляем query-параметр из activeQueryParams если он там есть
        this.activeQueryParams.categories = this.activeQueryParams.categories.filter(item => item !== value);
      }

    }
    this.activeQueryParams.page = 1;

    this.router.navigate([environment.apiPath.articles], {queryParams: this.activeQueryParams});
  }

  // по клику на document вне блока фильтрации закрываем блок с фильтрами
  @HostListener('document:click', ['$event'])
  click(event: MouseEvent) {
    if (this.filterOpened && !(event.target as HTMLElement).closest('.filter-select')) {
      this.toggleOpenFilter();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
