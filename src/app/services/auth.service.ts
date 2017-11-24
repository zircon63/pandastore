import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
@Injectable()
export class AuthService {
  private URL = '/api/';
  private jwtHelper: JwtHelper;
  user: User;
  constructor(private http: HttpClient) {
    this.user = new User();
    this.jwtHelper = new JwtHelper();
  }

  get getUser() {
    return <User>{
      id: Number(localStorage.getItem('id')),
      login: localStorage.getItem('login'),
      phone: localStorage.getItem('phone'),
      isAdmin: this.isAdmin()
    };
  }
  register(user: User): Observable<any> {
    return this.http.post(this.URL + 'register', user);
  }
  login(user: User): Observable<any> {
    return this.http.post(this.URL + 'login', user);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('login');
    localStorage.removeItem('phone');
  }
  getProfile(user: User): Observable<any> {
    return this.http.post(this.URL + 'profile', user);
  }

  isAuth() {
    return tokenNotExpired();
  }
  isAdmin() {
    const token = localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token).admin;
  }

}
