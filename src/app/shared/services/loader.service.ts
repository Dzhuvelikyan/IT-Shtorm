import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isShowedSubject = new BehaviorSubject<boolean>(false);
  public isShowed$ = this.isShowedSubject.asObservable();

  constructor() {}

  show(): void {
    this.isShowedSubject.next(true);
  }

  hide(): void {
    this.isShowedSubject.next(false);
  }

}
