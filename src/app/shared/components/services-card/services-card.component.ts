import {Component, Input} from '@angular/core';
import {ServiceType} from '../../../../types/service.type';

@Component({
  selector: 'app-services-card',
  standalone: false,
  templateUrl: './services-card.component.html',
  styleUrl: './services-card.component.scss'
})
export class ServicesCardComponent {

  pathWithImage: string = 'assets/images/services/';

  @Input() service: ServiceType;

  constructor() {
    this.service = {
      id: 0,
      image: '',
      title:  '',
      description: '',
      price: 0,
    }
  }



}
