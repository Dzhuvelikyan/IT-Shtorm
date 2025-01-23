import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-policy',
  standalone: false,
  template: `
    <section class="policy container">
      <h2 class="policy__title">Политика конфиденциальности</h2>
      <section class="policy__text" [innerHTML]="policyText"></section>
    </section>
  `,
})
export class PolicyComponent implements OnInit {
  policyText: string = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // Загрузка текста политики из файла
    this.http.get(environment.frontendDB + '/policy.html', {responseType: 'text'}).subscribe({
      next: (data) => this.policyText = data,
      error: (error) => console.error('Не удалось загрузить текст политики', error),
    });
  }
}

