import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ServiceType} from '../../../types/service.type';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private readonly http: HttpClient) { }

  public getServices(): Observable<ServiceType[] | []> {
    return this.http.get<ServiceType[] | []>("assets/data-base/services.json");
  }
}
