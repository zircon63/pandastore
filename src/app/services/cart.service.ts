import { Injectable } from '@angular/core';
import {Order} from '../models/order';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class CartService {
  Cart: Order[];
  private  URL = '/api/';
  constructor(private http: HttpClient, private authService: AuthService) {
    this.Cart = [];
  }
  add(product: Order) {
    const ind = this.search(product.id);
    if (ind !== -1) {
      this.Cart[ind].amount++;
    } else {
      this.Cart.push(product);
      this.Cart[this.Cart.length - 1].amount = 1;
    }
  }
  get CurrentCart() {
    return this.Cart;
  }
  incAmount(id) {
    const ind = this.search(id);
    this.Cart[ind].amount++;
  }
  decAmount(id) {
    const ind = this.search(id);
    if (this.Cart[ind].amount-- === 1) {this.delete(id); }
  }
  delete(id) {
    const ind = this.search(id);
    if (ind !== -1) {
        this.Cart.splice(ind, 1);
    }
  }
  search(id) {
    return this.Cart.map(product => product.id).indexOf(id);
  }
  isEmpty(){
    return this.Cart.length > 0 ? false : true;
  }
  getTotal() {
    return this.Cart.map(product => product.price * product.amount).reduce((a, b) => a + b, 0);
  }
  clearCart() {
    this.Cart = [];
  }
  performOrder(): Observable<any> {
    return this.http.put(this.URL + 'buy', {order: this.Cart, user_id: this.authService.getUser.id, total: this.getTotal()});
  }


}
