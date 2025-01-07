import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReviewType} from '../../../types/review.type';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private readonly http: HttpClient) { }

  public getReviews(): Observable<ReviewType[] | []> {
    return this.http.get<ReviewType[] | []>("assets/data-base/reviews.json");
  }

}
