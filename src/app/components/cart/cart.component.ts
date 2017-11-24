import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Product } from '../../models/product';
import { CartService} from '../../services/cart.service';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() show: boolean;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  products: Product[];
  msg;
  constructor(private cartService: CartService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.products = this.cartService.CurrentCart;
  }

  get isEmpty(): boolean {
    return this.cartService.isEmpty();
  }
  get Total(): number {
    return this.cartService.getTotal();
  }
  deleteFromCart(id) {
    this.cartService.delete(id);
  }

  closeCart() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  incAmount(id) {
    this.cartService.incAmount(id);
  }
  decAmount(id) {
    this.cartService.decAmount(id);
  }

  buy() {
    this.cartService.performOrder().subscribe(data => {
      if (data.success) {
        this.cartService.clearCart();
        this.products = this.cartService.CurrentCart;
        this.messageService.add({severity: 'success', summary: 'Order', detail: data.message});
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Order', detail: data.message});
      }
    });
  }

}
