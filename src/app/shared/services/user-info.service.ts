import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {ServiceType} from '../../../types/service.type';
import {UserInfoType} from '../../../types/user-info.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private readonly http: HttpClient) { }

  public getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>( environment.api + environment.apiPath.users).pipe(

      tap((userInfo: UserInfoType | DefaultResponseType) => {
        if((userInfo as DefaultResponseType).error) {
          throw new Error((userInfo as DefaultResponseType).message);
        }
      }),

      catchError((error: HttpErrorResponse) => {
        //передаем ошибку подписчику
        return throwError(() => error);
      })

    );
  }

}
