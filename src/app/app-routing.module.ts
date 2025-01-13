import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes, Scroll} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';
import {ViewportScroller} from '@angular/common';
import {filter} from 'rxjs';
import {authForwardGuard} from './core/auth/auth-forward.guard';


const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {path: '', component: MainComponent},
    {path: '', loadChildren: () => import("./views/auth/auth.module").then(m => m.AuthModule), canActivate: [authForwardGuard]},
    {path: '', loadChildren: () => import("./views/blog/blog.module").then(m => m.BlogModule)},
    {path: '**', redirectTo: '/'},
  ]
}];

@NgModule({

  //anchorScrolling: 'enabled' - включаем переход по якорям, scrollPositionRestoration: 'top' - при обновлении url скролив вверх страницы
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private viewportScroller: ViewportScroller, private router: Router) {

    //центрирование блока при переходе по якорным ссылкам
    this.router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe((event: Scroll) => {
        if (event.anchor) {
          setTimeout(() => {
            const el = document.querySelector(`#${event.anchor}`);
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // Центрирует элемент на экране
              });
            }
          }, 0);
        }
      });

  }
}
