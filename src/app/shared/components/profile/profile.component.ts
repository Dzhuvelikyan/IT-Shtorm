import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {UserInfoService} from '../../services/user-info.service';
import {UserInfoType} from '../../../../types/user-info.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private isLogged: boolean = false;

  public openedMenu: boolean = false;

  userInfo: UserInfoType = {} as UserInfoType;


  constructor(private readonly authService: AuthService,
              private readonly userInfoService: UserInfoService,
              private _snackBar: MatSnackBar) {

    // устанавливаем состояние авторизации при создании компонента
    this.isLogged = this.authService.getLoggedIn();
  }

  ngOnInit(): void {
    // подписываемся на изменения состояние авторизации пользователя
    this.authService.isLogged$.subscribe(isLogged => {

      // следим за состоянием авторизации в моменте
      this.isLogged = isLogged;

      // получаем данные о пользователе если он авторизован(при изменении состояния авторизации)
      this.getUserInfo(this.isLogged);
    });

    // получаем данные о пользователе если он авторизован(при создании компонента)
    this.getUserInfo(this.isLogged);
  }

  public getLogged(): boolean {
    return this.isLogged;
  }

  // получаем данные о пользователе если он авторизован
  private getUserInfo(isLogged: boolean): void {
    if (isLogged) {

      this.userInfoService.getUserInfo().subscribe({

        next: (userData: UserInfoType | DefaultResponseType) => {
          this.userInfo = userData as UserInfoType;
        },

        error(error: HttpErrorResponse) {
          console.error("Ошибка при получении данных о пользоватиеле: ", error);
        }

      });
    }

  }

  public toggleProfileMenu(): void {
    this.openedMenu = !this.openedMenu;
  }

  // по клику на document вне блока меню скрываем меню
  @HostListener('document:click', ['$event'])
  click(event: MouseEvent) {
    if (this.openedMenu && !(event.target as HTMLElement).closest('.profile')) {
      this.toggleProfileMenu();
    }
  }

  public logout(): void {
    this.authService.logout().subscribe((data: DefaultResponseType) => {

      if ((data as DefaultResponseType).error) {
        throw new Error((data as DefaultResponseType).message);
      }

      this.authService.removeTokens();//если refreshToken не найден то все рвно подчистим токены разлогиним пользователя
      this.authService.userId = null;//удаляем userId

      this._snackBar.open("Вы вышли из системы");

    });
  }

}
