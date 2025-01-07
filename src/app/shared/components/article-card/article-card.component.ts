import {Component, Input} from '@angular/core';
import {ArticleType} from '../../../../types/article.type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-article-card',
  standalone: false,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {

  protected readonly environment = environment;

  pathToImage: string = this.environment.staticImgPath + "articles/";

  @Input() article: ArticleType;

  constructor() {
    this.article = {
      id: '',
      title: '',
      description:  '',
      image: '',
      date: '',
      category: '',
      url: ''
    }
  }

}
