import { Pipe, PipeTransform } from '@angular/core';
import {Product} from '../models/product';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(products: any, args?: any): Product[] {
    const result: Product[] = products.filter(
      product => (product.price >= args.rangePrice[0] && product.price <= args.rangePrice[1])
    ).filter(
      product => (args.selectedCategory.indexOf(product.category.value) !== -1));
    return result;
  }


}
