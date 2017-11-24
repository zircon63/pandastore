import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {ProductService} from '../../../services/product.service';
import {SelectItem} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
import {Product} from '../../../models/product';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [CategoryService, ProductService]
})
export class StatsComponent implements OnInit {
  data: any;
  display: boolean;
  category: SelectItem[] = [];
  products: SelectItem[];
  selectedProducts: Product[];
  selectedCat;
  msg;
  income;
  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private messageService: MessageService) {
    this.categoryService.getCategory().subscribe(data => {
      if (data.success) {
        this.category = data.categories;
        this.selectedCat = this.category.map(c => c.value);
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Categories', detail: data.message});
      }
    });
    this.productService.getIncome().subscribe(data=>{
      if (data.success) {
        this.income = data.income;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get income', detail: data.message});
      }
    })
  }

  ngOnInit() {
  }

  getProduct(event) {
    const catId = event.value;
    this.productService.getProductByIdCategory(catId).subscribe(data => {
      if (data.success) {
        this.products = data.products.map(product => ({value: product, label: product.name}));
        console.log(this.products);
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Products', detail: data.message});
      }
    });
  }
  getStats(event) {
    const idProd = {id: event.value.id};
    this.productService.getStats(idProd).subscribe(data => {
      if (data.success) {
        this.data = data.stats;
        this.data.datasets[0].label = event.value.name;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Stats', detail: data.message});
      }
    });
  }
}
