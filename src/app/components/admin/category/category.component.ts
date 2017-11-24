import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../services/category.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Category} from '../../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [CategoryService]
})
export class CategoryComponent implements OnInit {
  categories: Category[];
  selectedCat: Category;
  msg;
  cat: Category;
  newCategory: boolean;
  displayDialog: boolean;
  constructor(private messageService: MessageService,
              private activeRouter: ActivatedRoute,
              private categoryService: CategoryService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.categoryService.getCategory().subscribe(data => {
      if (data.success) {
        this.categories = data.categories;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Category', detail: data.message});
      }
    });
  }


  showDialogToAdd() {
    this.newCategory = true;
    this.cat = new Category();
    this.cat.value = 0;
    this.displayDialog = true;
  }
  onRowSelect(event) {
    this.newCategory = false;
    this.cat = this.clone(event.data);
    this.displayDialog = true;
  }
  clone(c: Category): Category {
    const cat = new Category();
    for (const prop in c) {
      cat[prop] = c[prop];
    }
    return cat;
  }
  save(category) {
    if (category) {
      if (category.value == 0) {
        this.categoryService.newCategory(category).subscribe(data => {
          if (data.success) {
            this.categories = data.categories;
            this.displayDialog = false;
            this.messageService.add({severity: 'success', summary: 'New Category', detail: data.message});
          }
          else {
            this.messageService.add({severity: 'warn', summary: 'New Category', detail: data.message});
          }
        });
      }
      else {
        this.categoryService.editCategory(category).subscribe(data => {
          if (data.success) {
            this.categories = data.categories;
            this.displayDialog = false;
            this.messageService.add({severity: 'success', summary: 'Update Category', detail: data.message});
          }
          else {
            this.messageService.add({severity: 'warn', summary: 'Update Category', detail: data.message});
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
      this.categoryService.deleteCategory(id).subscribe(data => {
        if (data.success) {
          this.categories = data.categories;
          this.cat = null;
          this.displayDialog = false;
          this.messageService.add({severity: 'success', summary: 'Delete Category', detail: data.message});
        }
        else {
          this.messageService.add({severity: 'warn', summary: 'Delete Category', detail: data.message});
        }
      });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Form', detail: 'Not Valid'});
    }
  }

}
