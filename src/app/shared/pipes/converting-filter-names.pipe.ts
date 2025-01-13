import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertingFilterNames',
  standalone: false,
})

export class ConvertingFilterNamesPipe implements PipeTransform {

  private dictionary: { [key: string]: string } = {
    frilans: 'Фриланс',
    dizain: 'Дизаин',
    smm: 'SMM',
    target: 'Таргет',
    kopiraiting: 'Копирайтинг',
  };

  transform(value: string): string {
    if (!value) {
      return value;
    }

    const convertedValue = this.dictionary[value.toLowerCase()] || value;

    return convertedValue;
  }
}
