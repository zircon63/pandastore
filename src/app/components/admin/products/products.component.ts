import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../services/category.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Category} from '../../../models/category';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../models/product';
import {SelectItem} from 'primeng/primeng';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductService, CategoryService]
})
export class ProductsComponent implements OnInit {
  products: Product[];
  selectedProduct: Product;
  msg;
  product: Product;
  newProduct: boolean;
  category: SelectItem[];
  displayDialog: boolean;
  constructor(private messageService: MessageService,
              private activeRouter: ActivatedRoute,
              private categoryService: CategoryService,
              private productService: ProductService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      if (data.success) {
        this.products = data.products;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Products', detail: data.message});
      }
    });
    this.categoryService.getCategory().subscribe(data => {
      if (data.success) {
        this.category = data.categories;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Category', detail: data.message});
      }
    });
  }


  showDialogToAdd() {
    this.newProduct = true;
    this.product = new Product();
    this.product.category = {label: '', value: 1};
    this.product.id = 0;
    this.displayDialog = true;
  }
  onRowSelect(event) {
    this.newProduct = false;
    this.product = this.clone(event.data);
    this.displayDialog = true;
  }
  clone(c: Product): Product {
    const product = new Product();
    for (const prop in c) {
      product[prop] = c[prop];
    }
    return product;
  }
  save(product) {
    if (product) {
      if (product.id == 0) {
        this.productService.newProduct(product).subscribe(data => {
          if (data.success) {
            this.products = data.products;
            this.displayDialog = false;
            this.messageService.add({severity: 'success', summary: 'New Product', detail: data.message});
          }
          else {
            this.messageService.add({severity: 'warn', summary: 'New Product', detail: data.message});
          }
        });
      }
      else {
        this.productService.editProduct(product).subscribe(data => {
          if (data.success) {
            this.products = data.products;
            this.displayDialog = false;
            this.messageService.add({severity: 'success', summary: 'Update Product', detail: data.message});
          }
          else {
            this.messageService.add({severity: 'warn', summary: 'Update Product', detail: data.message});
          }
        });
      }
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Form', detail: 'Not Valid'});
    }
  }
  delete(id) {
    if (id) {
      this.productService.deleteProduct(id).subscribe(data => {
        if (data.success) {
          this.products = data.products;
          this.product = null;
          this.displayDialog = false;
          this.messageService.add({severity: 'success', summary: 'Delete Product', detail: data.message});
        }
        else {
          this.messageService.add({severity: 'warn', summary: 'Delete Product', detail: data.message});
        }
      });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Form', detail: 'Not Valid'});
    }
  }

}
