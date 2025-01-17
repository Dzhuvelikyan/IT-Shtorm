import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServicesService} from '../../services/services.service';
import {ServiceType} from '../../../../types/service.type';
import {tap} from 'rxjs';
import {OrderTypeEnum} from '../../../../enum/order-type.enum';
import {FormDialogDataType} from '../../../../types/form-dialog-data.type';
import {OrderService} from '../../services/order.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {scaleAnimation} from '../../utils/animations.util';

@Component({
  selector: 'app-form-dialog',
  standalone: false,
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  animations: [scaleAnimation]
})
export class FormDialogComponent implements OnInit {

  // Состояние заказа, если "true" скроем форму и покажем блок спасибо
  public isOrderDone: boolean = false;

  // Ошибка в ответе от сервера(показываем текст ошибки)
  public isErrorResponse: boolean = false;

  //типы заказа
  readonly orderTypeEnum = OrderTypeEnum;

  //тип оформления заказа для запроса
  public orderType: OrderTypeEnum = OrderTypeEnum.consultation;

  // Получаем переданные данные в dialog(тип заказа OrderTypeEnum)
  public readonly dialogData: FormDialogDataType = inject<FormDialogDataType>(MAT_DIALOG_DATA);

  // Массив с категориями услуг
  servicesCategory: string[] = [];

  public orderForm!: FormGroup;

  constructor(private readonly fb: FormBuilder,
              private readonly serviceService: ServicesService,
              private readonly orderService: OrderService,
              private readonly _snackBar: MatSnackBar,) {


  }

  ngOnInit(): void {

    // инициализируем форму
    this.initOrderForm();

    //заполняем массив с категориями услуг
    this.serviceService.getServices().pipe(
      tap((services: ServiceType[]) => {
        if (services) {
          services.forEach(service => {
            // заполняем массив с категориями услуг
            this.servicesCategory.push(service.title);
          });
        }
      })
    ).subscribe();

  }

  // инициализируем форму
  private initOrderForm(): void {

    // записываем полученный тип заказа из вне
    this.orderType = this.dialogData.orderType;

    this.orderForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[А-ЯЁ][а-яё]*$/),]],//только русские буквы

      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9\s\-\(\)]{7,15}$/)
      ]],

      type: [this.orderType],
    });

    // добавляем в форму select со списком услуг если передан тип "order"
    if (this.orderType === OrderTypeEnum.order) {
      this.orderForm.addControl('service', new FormControl(this.dialogData.service, Validators.required))
    }
  }

  // отправка запроса
  public clickCreateOrder(): void {

    if (this.orderForm.invalid) return;
    console.log(this.orderForm.value)
    this.orderService.createOrder(this.orderForm.value).subscribe({

      next: (DefaultResponse: DefaultResponseType) => {
        if (DefaultResponse.error) {
          // информируем пользователя об ошибке
          this.showErrorResponseMsg();
        }

        // Показываем блок спасибо
        this.isOrderDone = true;

      },

      error: (error: HttpErrorResponse) => {

        // информируем пользователя об ошибке
        this.showErrorResponseMsg();
        throw new Error(error.message);
      },

    });

  }

  // Показываем сообщении об ошибке на 2.5 сек
  private showErrorResponseMsg(): void {
    this.isErrorResponse = true;
    setTimeout(() => {
      this.isErrorResponse = !this.isErrorResponse;
    }, 2500)
  }

  // попробывать в будующем переделать  в директиву
  public processPhoneValue(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Удаляем все символы, кроме цифр и "+"
    let value = input.value.replace(/[^0-9+]/g, '');

    // Удаляем лишние "+" (оставляем только один, если он есть, и только в начале)
    value = value.replace(/(?!^)\+/g, '');

    // форматируем номер что-бы он начинался с "+7"
    if (value.match(/^9/)) {
      value = '+7' + value;
    } else if (value.match(/^7/)) {
      value = '+' + value;
    } else if (value.match(/^8/)) {
      value = value.replace(/^8/, '+7')
    }

    // Обновляем значение как в input, так и в форме
    input.value = value;
    this.orderForm.get('phone')?.setValue(value);
  }

}


