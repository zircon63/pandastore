import {Product} from './product';
import {SelectItem} from 'primeng/primeng';

export class Order implements Product {
  category: SelectItem;
  id: number;
  name: string;
  price: number;
  desc: string;
  amount: number;
  status?: string;
  id_status?: number;
}
