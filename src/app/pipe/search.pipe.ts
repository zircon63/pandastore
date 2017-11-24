import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(products: any, args?: any): any {
    if (args.length > 0) {
      return products.filter(product => (product.name.indexOf(args) !== -1));
    }
    else {return products; }
  }

}
