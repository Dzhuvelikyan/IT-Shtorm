import {Component} from '@angular/core';
import {FormBuilder, FormGroup, RequiredValidator, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;

    // состояние видимости пароля
  isPasswordVisible: boolean = false;

  constructor(private readonly router: Router,
              private fb: FormBuilder,
              private readonly authService: AuthService,) {

    // инициализируем FormGroup
    this.signupForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[А-ЯЁ][а-яё]*(\s[А-ЯЁ][а-яё]*)*$/), // Русские буквы и каждое слово с заглавной буквы
      ]],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // содержать 8 символов, минимум 1 букву в верхнем регистре и минимум 1 цифру
      ]],

      agree: [false, [Validators.requiredTrue]],
    });

  }

  public signup(): void {

    if (this.signupForm.invalid) return;

    //исключаем поле "agree" из "signupForm" так, как в запросе на бэк он ненужен
    this.signupForm.get('agree')?.disable();

    this.authService.auth("signup", this.signupForm.value).subscribe({
      //регистрация происходит в сервисе
      error: () => {
        throw new Error("Произошла ошибка при регистрации пользователя.");
      },
    });

  }

  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
