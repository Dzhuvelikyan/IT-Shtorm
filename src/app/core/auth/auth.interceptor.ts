import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, switchMap, throwError} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {AuthTokensType} from '../../../types/auth/auth-tokens.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const tokens = this.authService.getTokens();

    //если токены есть значит пользователь авторизован и мы добавляем авторизационный токен к запросу
    if (tokens && tokens.accessToken) {

      const authRequest = req.clone({
        headers: req.headers.set("x-auth", tokens.accessToken)
      });

      // отправляем запрос дальше с добавленным авторизационным заголовком
      return next.handle(authRequest).pipe(

        //обработка ошибок
        catchError((error) => {

          //если эта ошибка 400(неавторизован) и это не запросы на авторизацию или обновление токенов
          if (error.status === 500 || error.status === 400 && !req.url.includes("/signup") && !req.url.includes("/refresh")) {
            return this.process400Error(authRequest, next);
          }

          //если это ошибка не 400 и не 500 просто возвращаем observable-ошибку
          return throwError(()=> error);
        }),

      );

    } else {

      //если токенов нет отправляем запрос дальше без изменений
      return next.handle(req);

    }

  }

  //обработчик ошибки 400
  process400Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(

        //переключаемся на другой observable
        switchMap((result: DefaultResponseType | AuthTokensType) => {
          let error = "";

          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = (result as AuthTokensType);
          if (!refreshResult.accessToken && !refreshResult.refreshToken && !refreshResult.userId) {
            error = "Ошибка авторизациии при попытке обновить токены";
          }

          if (error) {
            //если ошибка есть то возвращаем observable-ошибку
            return throwError(() => new Error(error));
          } else {
            //если ошибки нет устанавлеваем новые полученные токены
            this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          }


          const authReq = req.clone({
            headers: req.headers.set("x-auth", refreshResult.accessToken)
          });

          return next.handle(authReq);

        }),

        //если при обновлении токенов произошла ошибка разлогиним поользователя и вернем на главную
        catchError(error => {
          this.authService.removeTokens();
          this._snackBar.open("Ошибка авторизации, вы вышли из системы!");
          return throwError(()=> error);
        })

      )
  }

}

