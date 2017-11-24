import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CategoryService {
  private URL = '/api/category';
  constructor(private http: HttpClient) { }
  getCategory(): Observable<any> {
    return this.http.get(this.URL);
  }
  newCategory(category): Observable<any> {
    return this.http.post(this.URL, category);
  }
  editCategory(category): Observable<any> {
    return this.http.put(this.URL, category);
  }
  deleteCategory(id): Observable<any> {
    return this.http.delete(this.URL + '/' + id);
  }

}
