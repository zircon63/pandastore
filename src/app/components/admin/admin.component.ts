import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  items: MenuItem[];
  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Back to Shop',
        icon: 'fa-backward',
        routerLink: ['/'],
      },
      {
        label: 'Category',
        icon: 'fa-edit',
        routerLink: ['/admin/category'],
      },
      {
        label: 'Products',
        icon: 'fa-cubes',
        routerLink: ['/admin/products'],
      },
      {
        label: 'Orders',
        icon: 'fa-align-left',
        routerLink: ['/admin/orders']
      },
      {
        label: 'Statistics',
        icon: 'fa-bar-chart-o',
        routerLink: ['/admin/stats'],
      },
    ];
  }

}
