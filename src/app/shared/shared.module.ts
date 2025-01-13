import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BannerCarouselComponent} from './components/banner-carousel/banner-carousel.component';
import {ServicesCardComponent} from './components/services-card/services-card.component';
import {RouterLink} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {FilterSelectComponent} from './components/filter-select/filter-select.component';
import {ConvertingFilterNamesPipe} from './pipes/converting-filter-names.pipe';
import {CommentsComponent} from './components/comments/comments.component';
import {CommentCardComponent} from './components/comment-card/comment-card.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
    FilterSelectComponent,
    CommentsComponent,
    CommentCardComponent,
    ProfileComponent,

    ConvertingFilterNamesPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    CarouselModule,
    RouterLink,
  ],
  exports: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
    FilterSelectComponent,
    CommentsComponent,
    CommentCardComponent,
    ProfileComponent,

    ConvertingFilterNamesPipe
  ]
})
export class SharedModule { }
