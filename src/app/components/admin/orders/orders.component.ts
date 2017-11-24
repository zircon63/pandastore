import { Component, OnInit } from '@angular/core';
import {Order} from '../../../models/order';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../../../services/order.service';
import {FormBuilder} from '@angular/forms';
import {SelectItem} from "primeng/primeng";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [OrderService]
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  selectedOrder: Order;
  msg;
  order: Order;
  newOrder: boolean;
  displayDialog: boolean;
  status: SelectItem[];
  constructor(private messageService: MessageService,
              private activeRouter: ActivatedRoute,
              private orderService: OrderService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      if (data.success) {
        this.orders = data.orders;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Products', detail: data.message});
      }
    });
    this.orderService.getListStatus().subscribe(data => {
      if (data.success) {
        this.status = data.statusList;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Products', detail: data.message});
      }
    });
  }

  edit(order) {
    this.newOrder = false;
    this.order = this.clone(order);
    this.displayDialog = true;
  }
  clone(c: Order): Order {
    const order = new Order();
    for (const prop in c) {
      order[prop] = c[prop];
    }
    return order;
  }
  save(order) {
    if (order) {
        this.orderService.editOrder(order).subscribe(data => {
          if (data.success) {
            this.orders = data.orders;
            this.displayDialog = false;
            this.messageService.add({severity: 'success', summary: 'Update Order', detail: data.message});
          }
          else {
            this.messageService.add({severity: 'warn', summary: 'Update Order', detail: data.message});
          }
        });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Form', detail: 'Not Valid'});
    }
  }
  delete(id) {
    if (id) {
      this.orderService.deleteOrder(id).subscribe(data => {
        if (data.success) {
          this.orders = data.orders;
          this.order = null;
          this.displayDialog = false;
          this.messageService.add({severity: 'success', summary: 'Delete Order', detail: data.message});
        }
        else {
          this.messageService.add({severity: 'warn', summary: 'Delete Order', detail: data.message});
        }
      });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Form', detail: 'Not Valid'});
    }
  }

}
