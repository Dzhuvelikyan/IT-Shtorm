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
import {FormDialogComponent} from './components/form-dialog/form-dialog.component';
import {MatDialogClose} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {PhoneMaskPipe} from './pipes/phone-mask.pipe';
import {LoaderComponent} from './components/loader/loader.component';
import {ShareToSocialComponent} from './components/share-to-social/share-to-social.component';



@NgModule({
  declarations: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
    FilterSelectComponent,
    CommentsComponent,
    CommentCardComponent,
    ProfileComponent,
    FormDialogComponent,
    LoaderComponent,
    ShareToSocialComponent,

    ConvertingFilterNamesPipe,
    PhoneMaskPipe
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        CarouselModule,
        RouterLink,
        MatDialogClose,
        MatButton,
    ],
  exports: [
    BannerCarouselComponent,
    ServicesCardComponent,
    ArticleCardComponent,
    FilterSelectComponent,
    CommentsComponent,
    CommentCardComponent,
    ProfileComponent,
    FormDialogComponent,
    LoaderComponent,
    ShareToSocialComponent,

    ConvertingFilterNamesPipe,
    PhoneMaskPipe
  ]
})
export class SharedModule { }
