import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  // состояние видимости пароля
  isPasswordVisible: boolean = false;


  constructor(private readonly router: Router,
              private fb: FormBuilder,
              private readonly authService: AuthService,
              private _snackBar: MatSnackBar,) {

    // инициализируем FormGroup
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

  }

  public login(): void {

    if (this.loginForm.invalid) return;

    this.processValueForm();

    this.authService.auth("login", this.loginForm.value)
      .subscribe(() => {
        this._snackBar.open("Вы вошли в систему");
    });

  }

  // обработка значений формы
  private processValueForm(): void {

    // приводим значение email к нижнему регистру
    const emailValue = this.loginForm.get('email')?.value;
    if (emailValue) {
      this.loginForm.get('email')?.setValue(emailValue.toLowerCase());
    }

  };

  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
