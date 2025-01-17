import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit, OnDestroy {

  isShowed: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private readonly loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.isShowed$.pipe(takeUntil(this.destroy$)).subscribe(isShowed => {
      this.isShowed = isShowed;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
