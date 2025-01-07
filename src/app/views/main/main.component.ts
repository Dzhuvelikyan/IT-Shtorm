import {Component, OnInit} from '@angular/core';
import {ServicesService} from '../../shared/services/services.service';
import {ServiceType} from '../../../types/service.type';
import {ArticleService} from '../../shared/services/article.service';
import {ArticleType} from '../../../types/article.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {ReviewType} from '../../../types/review.type';
import {ReviewsService} from '../../shared/services/review.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  protected readonly environment = environment;

  services: ServiceType[] = [];

  articles: ArticleType[] = [];

  reviews: ReviewType[] = [];

  carouselReviewOption: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 26,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1.5
      },
      768: {
        items: 2
      },
      1024: {
        items: 3
      },
      1200: {
        items: 3
      }
    },
    navText: ['', ''],
    nav: false,
  }

  constructor(private readonly servicesService: ServicesService,
              private readonly articleService: ArticleService,
              private readonly reviewService: ReviewsService,) {
  }

  ngOnInit() {

    this.servicesService.getServices().subscribe((data: ServiceType[]) => {
        this.services = data;
    });

    this.articleService.getPopularArticles().subscribe({

      next: (data: ArticleType[] | DefaultResponseType) => {
        this.articles = data as ArticleType[];
      },

      error: () => {
        throw new Error("Возникла ошибка при получении популярных статей");
      }

    });

    this.reviewService.getReviews().subscribe((data: ReviewType[]) => {
      this.reviews = data;
    });

  }

}
