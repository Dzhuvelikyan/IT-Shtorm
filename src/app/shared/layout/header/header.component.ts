import {Component, ElementRef, ViewChild} from '@angular/core';
import {StateClasses} from '../../../../enum/state-classes.enum';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('burgerButton', {static: true}) burgerButton!: ElementRef;
  @ViewChild('headerOverlay', {static: true}) headerOverlay!: ElementRef;

  phone: string = environment.phone;

  //CSS классы которые будем добавлять по ситуации
  stateClasses = StateClasses;

  constructor() {}


  //открытие, закрытие бургер меню(мобильное меню)
  public onBurgerButtonClick(): void {
    this.burgerButton.nativeElement.classList.toggle(this.stateClasses.isActive);
    this.headerOverlay.nativeElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  }

  public closeBurgerMenu(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (target.hasAttribute("data-menu-link")) {
      this.onBurgerButtonClick();
    }
  }

}
