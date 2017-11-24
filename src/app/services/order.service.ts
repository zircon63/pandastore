import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrderService {
  private URL = '/api/orders';
  constructor(private http: HttpClient) { }
  getOrders(): Observable<any> {
    return this.http.get(this.URL);
  }
  editOrder(order): Observable<any> {
    return this.http.put(this.URL, order);
  }
  deleteOrder(id): Observable<any> {
    return this.http.delete(this.URL + '/' + id);
  }
  getListStatus(): Observable<any> {
    return this.http.get(this.URL + '/liststatus');
  }


  }
