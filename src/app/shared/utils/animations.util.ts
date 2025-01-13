import { trigger, state, style, transition, animate } from '@angular/animations';

// парамерты для анимации scaleAnimation
const scaleAnimationOption = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
  }
};

//Aнимация
export const scaleAnimation = trigger('scaleAnimation', [

  // состояние "скрыт"
  state('void', style(scaleAnimationOption.hidden)),
  // состояние "виден"
  state('*', style(scaleAnimationOption.visible)),

  // переход при входе
  transition(':enter', [
    animate('500ms ease-in')
  ]),

  // переход при выходе
  transition(':leave', [
    animate('500ms ease-out')

  ]),
]);
