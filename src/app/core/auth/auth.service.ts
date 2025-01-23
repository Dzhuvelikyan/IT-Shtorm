import {Injectable} from '@angular/core';
import {catchError, finalize, Observable, Subject, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthTokensType} from '../../../types/auth/auth-tokens.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {AuthUserType} from '../../../types/auth/auth-user.type';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //ключи по которым будем обращаться
  private readonly accessTokenKey: string = 'accessToken';
  private readonly refreshTokenKey: string = 'refreshToken';
  private readonly userIdKey: string = 'userId';

  //состояние авторизации пользователя
  private isLogged: boolean = false;
  public isLogged$: Subject<boolean> = new Subject<boolean>();// Subject для отслеживание состояния авторизации(isLogged)

  constructor(private readonly http: HttpClient,
              private readonly router: Router,
              private _snackBar: MatSnackBar) {

    //проверяем залогинен пользователь или нет при запуске или перезапуске приложения
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  //используем для получения состояния авторизации вне сервиса
  public getLoggedIn(): boolean {
    return this.isLogged;
  }


  //взаимодействие с токенами
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;// изменяем состояния авторизации на true после получения и сохранения токенов
    this.isLogged$.next(this.isLogged);// оповещаем слушателей isLogged$ об изменении состояния авторизации
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  };

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;// изменяем состояния авторизации на false после удаления токенов
    this.isLogged$.next(this.isLogged);// оповещаем слушателей isLogged$ об изменении состояния авторизации
  }


  //взаимодействие с ID пользователя через сеттер и геттер
  set userId(id: string | null) {
    //если передаем null то удаляем данные из хранилища если id то записываем
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }


  // Авторизационные запросы:
  // универсальный метод для авторизации и регистрации
  public auth(authType: 'login' | 'signup', body: AuthUserType): Observable<AuthTokensType | DefaultResponseType> {

    return this.http.post<AuthTokensType | DefaultResponseType>(`${environment.api}/${authType}`, body).pipe(
      tap((data: AuthTokensType | DefaultResponseType) => {

        if ((data as DefaultResponseType).error) {
          this._snackBar.open((data as DefaultResponseType).message);
          throw new Error((data as DefaultResponseType).message);
        }

        const dataAuth: AuthTokensType = (data as AuthTokensType);

        // сохраняем полученные авторизационные данные пользователя и переводим его на главную страницу
        if (dataAuth.accessToken && dataAuth.refreshToken && dataAuth.userId) {
          this.setTokens(dataAuth.accessToken, dataAuth.refreshToken);
          this.userId = dataAuth.userId;
          this.router.navigate(["/"]);
        }

      }),

      catchError((error: HttpErrorResponse) => {
        console.error('Ошибка аутентификации пользователя:', error);
        this._snackBar.open(error.error.message);
        return throwError(() => error);//передаем ошибку подписчику
      })
    );
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {

      return this.http.post<DefaultResponseType>(environment.api + "/logout", {refreshToken: tokens.refreshToken}).pipe(
        catchError((error: HttpErrorResponse) => {
          this.removeTokens();
          this.userId = null;
          console.error('Ошибка при выходе из системы: ', error.error.message);
          this._snackBar.open("Вы вышли из системы с ошибкой");
          return throwError(() => error);//передаем ошибку подписчику
        })
      );

    } else {
      //если refreshToken не найден то все рвно подчистим токены разлогиним пользователя
      this.removeTokens();
      this.userId = null;
      this._snackBar.open("Вы вышли из системы с ошибкой");
      throw new Error( "токены не найдены");
    }
  }

  public refresh(): Observable<AuthTokensType | DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<AuthTokensType | DefaultResponseType>(environment.api + "/refresh", {refreshToken: tokens.refreshToken});
    }
    throw throwError(()=> "запрос refreshTokens: токены не найдены");
  }

}

