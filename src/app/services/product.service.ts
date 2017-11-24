import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ProductService {
  private URL = '/api/products';
  constructor(private http: HttpClient) { }
  getProducts(): Observable<any> {
    return this.http.get(this.URL);
  }
  getProductByIdCategory(id): Observable<any> {
    return this.http.get(this.URL + '/' + id);
  }
  newProduct(product): Observable<any> {
    return this.http.post(this.URL, product);
  }
  editProduct(product): Observable<any> {
    return this.http.put(this.URL, product);
  }
  deleteProduct(id): Observable<any> {
    return this.http.delete(this.URL + '/' + id);
  }

  getStats(id): Observable<any> {
    return this.http.post('/api/stats/product', id);
  }

  getIncome(): Observable<any> {
    return this.http.get('/api/stats/income');
  }

  }
