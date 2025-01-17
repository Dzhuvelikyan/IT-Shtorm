import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'phoneMaskPipe'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    //удаляем символы не являющиеся цифрами
    const phoneNumber: string = value.replace(/\D+/g, '');

    //проверяем длинну символов для номера
    if (phoneNumber.length < 11) {
      return "";
    }

    const code: string = phoneNumber.slice(0, 1); // 7
    const operator: string = phoneNumber.slice(1, 4); // (999)
    const group1: string = phoneNumber.slice(4, 7); // 000
    const group2: string = phoneNumber.slice(7, 9); // 00
    const group3: string = phoneNumber.slice(9, 11); // 00

    // если номер начинается с "8" испрвляем на "7"
    if (code.match(/^8/)) {
      value = value.replace(/^8/, '7')
    }

    return `+${code} (${operator}) ${group1}-${group2}-${group3}`; //+7 (999) 000-00-00

  }

}
