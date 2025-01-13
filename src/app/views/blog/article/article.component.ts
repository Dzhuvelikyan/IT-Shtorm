import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../../shared/services/article.service';
import {ActivatedRoute} from '@angular/router';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {ArticleDetailsType} from '../../../../types/article/article-details.type';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {ArticleType} from '../../../../types/article/article.type';
import {CommentsService} from '../../../shared/services/comments.service';

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})

export class ArticleComponent implements OnInit {

  //путь до картинок(frontend)
  pathToImage: string = environment.staticImgPath + environment.apiPath.articles + "/";

  //для безопасного отображения html-контента полученного с сервера в component.html
  sanitizedHtml: SafeHtml = `<h3>Контент от сервера</h3>`;

  //детали статьи
  detailsArticle: ArticleDetailsType = {} as ArticleDetailsType;

  //массив связанных статей
  relatedArticles: ArticleType[] = [];

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly articleService: ArticleService,
              private readonly commentsService: CommentsService,
              private sanitizer: DomSanitizer,//для отображения полученного HTML из бэка
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      if (params['url']) {

        //получение деталей статьи
        this.articleService.getDetailsArticle(params['url']).subscribe({

          next: (data: ArticleDetailsType | DefaultResponseType) => {

            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            // детали статьи
            this.detailsArticle = data as ArticleDetailsType;

            // отображаем полученный html(this.detailsArticle.text) на странице (безопасный подход)
            this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.detailsArticle.text);

            // получаем комменты статьи


          },

          error: () => {
            throw new Error("Из-за ошибки в запросе на сервер не удалось получить детали статьи.");
          }

        });

        //получаем связанные статьи
        this.articleService.getRelatedArticles(params['url']).subscribe({

          next: (data: ArticleType[] | DefaultResponseType) => {

            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.relatedArticles = data as ArticleType[];

          },

          error: () => {
            throw new Error("Из-за ошибки в запросе на сервер не удалось получить массив связанных статей.");
          }

        });

      }

    });
  }




}

//переопределение полученных с бэка HTML-элементов в нужные мне элементы для стилизации(не понял работу бэка и сделал этот функционал, долго мучился удалять не буду)) )
// private redefinitionElementAsync(): void {
//
//   setTimeout(()=> {
//     // элементы которые будем переставлять
//     const h1Element = this.elementRef.nativeElement.querySelector('.backend-content h1');
//     const textElement = this.elementRef.nativeElement.querySelector('.backend-content h1 + p');
//
//     // элемент в который будем вставлять
//     const newParent = this.elementRef.nativeElement.querySelector('.article-main__info');
//
//     if (newParent) {
//       //переставляем элементы
//       if (h1Element) {this.renderer.appendChild(newParent, h1Element);}
//       if (textElement) {this.renderer.appendChild(newParent, textElement);}
//     }
//   }, 0);
//
// }
