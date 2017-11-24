import { Component, OnInit } from '@angular/core';
import {Product} from '../../models/product';
import {CartService} from '../../services/cart.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';
import {ProductService} from '../../services/product.service';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
  providers: [MessageService, ProductService, CategoryService]
})
export class ListProductsComponent implements OnInit {
  displayFilter: false;
  products: Product[] = [];
  msg: Message[] = [];
  filterParams;
  searchText;
  maxPrice;
  category: SelectItem[] = [];
  constructor(
    private cartService: CartService,
    private messageService: MessageService,
    private productService: ProductService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.filterParams = {rangePrice: [], selectedCategory: []};
    this.productService.getProducts().subscribe(data => {
      if (data.success) {
        data.products.forEach(prod => {
          prod.price = prod.price_sale;
          delete prod.price_sale;
          delete prod.price_buy;
        });
        this.products = data.products;
        this.maxPrice = Math.max.apply(null, this.products.map(p => p.price));
        this.filterParams.rangePrice = [0, this.maxPrice];
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Products', detail: data.message});
      }
    });
    this.categoryService.getCategory().subscribe(data => {
      if (data.success) {
        this.category = data.categories;
        this.filterParams.selectedCategory = this.category.map(c => c.value);
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Categories', detail: data.message});
      }
    });
    this.searchText = '';
  }

  addToCart(product) {
    this.cartService.add(product);
    this.messageService.add({severity: 'success', summary: 'Add to Cart', detail: product.name + ' is added'});
  }

}
