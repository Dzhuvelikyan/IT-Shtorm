import {Component, Input} from '@angular/core';
import {ServiceType} from '../../../../types/service.type';
import {FormDialogComponent} from '../form-dialog/form-dialog.component';
import {OrderTypeEnum} from '../../../../enum/order-type.enum';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-services-card',
  standalone: false,
  templateUrl: './services-card.component.html',
  styleUrl: './services-card.component.scss'
})
export class ServicesCardComponent {

  pathWithImage: string = 'assets/images/services/';

  @Input() service: ServiceType;

  constructor(public readonly _dialog: MatDialog) {

    this.service = {
      id: 0,
      image: '',
      title:  '',
      description: '',
      price: 0,
    }

  }

  public openDialog(): void {
    this._dialog.open(FormDialogComponent, { data: { orderType: OrderTypeEnum.order, service: this.service.title } });
  }

}
