import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import { Location } from '@angular/common';

//этот guard не позволяет залогиненому пользователю попасть на страницу авторизации и регистрации,
export const authForwardGuard: CanActivateFn = (route, state) => {

  // получаем сервисы
  const authService = inject(AuthService);
  const location = inject(Location);

  //если пользователь залогинен возврачаем false и переводим пользователя на предидущую страницу(ту на которой был)
  if (authService.getLoggedIn()) {
    location.back();
    return false;
  }

  //если пользователь не залогинен возврачаем true(разрешаем попасть на страницы аутентификации)
  return true;

};
