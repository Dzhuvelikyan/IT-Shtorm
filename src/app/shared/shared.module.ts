import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BannerCarouselComponent} from './components/banner-carousel/banner-carousel.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServicesCardComponent} from './components/services-card/services-card.component';
import {RouterLink} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ArticleCardComponent} from './components/article-card/article-card.component';



@NgModule({
  declarations: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CarouselModule,
    RouterLink,
  ],
  exports: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
  ]
})
export class SharedModule { }
