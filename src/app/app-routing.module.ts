import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';


const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {path: '', component: MainComponent},
    {path: '', loadChildren: () => import("./views/auth/auth.module").then(m => m.AuthModule), canActivate: []},//canActivate: [authForwardGuard]
  ]
}];

@NgModule({

  //anchorScrolling: 'enabled' - включаем переход по якорям, scrollPositionRestoration: 'top' - при обновлении url скролив вверх страницы
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
