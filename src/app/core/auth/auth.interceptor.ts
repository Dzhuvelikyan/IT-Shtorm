import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const tokens = this.authService.getTokens();

    //если токены есть значит пользователь авторизован и мы добавляем авторизационный токен к запросу
    if (tokens && tokens.accessToken) {

      const authRequest = req.clone({
        headers: req.headers.set("x-auth", tokens.accessToken)
      });

      // отправляем запрос дальше с добавленным авторизационным заголовком
      return next.handle(authRequest);

    } else {

      //если токенов нет отправляем запрос дальше без изменений
      return next.handle(req);

    }

  }
}

