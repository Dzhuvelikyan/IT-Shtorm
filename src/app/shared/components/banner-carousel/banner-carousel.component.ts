import {Component} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {MatDialog} from '@angular/material/dialog';
import {FormDialogComponent} from '../form-dialog/form-dialog.component';
import {OrderTypeEnum} from '../../../../enum/order-type.enum';
import {ServiceType} from '../../../../types/service.type';

@Component({
  selector: 'app-banner-carousel',
  standalone: false,
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss'
})
export class BannerCarouselComponent {

  topService = {
    promotion: "Продвижение",
    advertising: "Реклама",
    copywriting: "Копирайтинг",
  }

  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
      }
    },
    navText: ['', ''],
    nav: false,
  }

  services: ServiceType[] = [];

  constructor(public readonly _dialog: MatDialog) {}

  public openDialog(service: string): void {
    this._dialog.open(FormDialogComponent, { data: { orderType: OrderTypeEnum.order, service } });
  }

}
