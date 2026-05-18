import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Product} from "../models/product.model";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>(environment.apiUrl + '/parkings');
  }
}
