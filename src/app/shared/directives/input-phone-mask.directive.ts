import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInputPhoneMaskDirective]',
  standalone: false,
})
export class InputPhoneMaskDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // Слушаем событие ввода (input)
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;

    // Текущий текст в поле ввода
    let value = input.value;

    // Удаляем все символы, кроме цифр и "+"
    value = value.replace(/[^0-9+]/g, '');

    // Удаляем лишние "+" (оставляем только один, если он есть, и только в начале)
    value = value.replace(/(?!^)\+/g, '');

    // Форматируем номер, чтобы он начинался с "+7"
    if (value.match(/^9/)) {
      value = '+7' + value;
    } else if (value.match(/^7/)) {
      value = '+' + value;
    } else if (value.match(/^8/)) {
      value = value.replace(/^8/, '+7');
    }

    // Применяем маску для номера телефона
    value = value
      .replace(/^(\+7)(\d{3})(\d{0,3})(\d{0,2})(\d{0,2})/, (match, p1, p2, p3, p4, p5) => {
        let formatted = p1;
        if (p2) formatted += ` (${p2}`;
        if (p3) formatted += `) ${p3}`;
        if (p4) formatted += `-${p4}`;
        if (p5) formatted += `-${p5}`;
        return formatted;
      });

    // Ограничиваем ввод до 16 символов(считается вместе со спец символами)
    value = value.slice(0, 18);

    // Обновляем значение в поле ввода
    input.value = value;
  }
}

