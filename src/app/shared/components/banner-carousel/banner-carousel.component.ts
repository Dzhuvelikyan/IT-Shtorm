import {Component} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-banner-carousel',
  standalone: false,
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss'
})
export class BannerCarouselComponent {

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
      },
      330: {
        items: 1
      },
      425: {
        items: 1
      },
      500: {
        items: 1
      },
      768: {
        items: 1
      },
      1024: {
        items: 1
      },
      1600: {
        items: 1
      },
      1920: {
        items: 1
      }
    },
    navText: ['', ''],
    nav: false,
  }

  constructor() {
  }

}
