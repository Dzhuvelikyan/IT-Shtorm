import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormDialogComponent} from '../../components/form-dialog/form-dialog.component';
import {OrderTypeEnum} from '../../../../enum/order-type.enum';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  phone: string = environment.phone;
  email: string = environment.email;
  socialNetworkUrl = {
    vk: environment.vk,
    instagram: environment.instagram,
    facebook: environment.facebook,
  }

  constructor( public readonly _dialog: MatDialog ) {
  }

  public openDialog(): void {
    this._dialog.open(FormDialogComponent, { data: { orderType: OrderTypeEnum.consultation } });
  }

}
