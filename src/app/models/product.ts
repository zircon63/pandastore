import {SelectItem} from 'primeng/primeng';

export class Product {
  id: number;
  category: SelectItem;
  name: string;
  price?: number;
  desc: string;
  price_sale?: number;
  price_buy?: number;
}
