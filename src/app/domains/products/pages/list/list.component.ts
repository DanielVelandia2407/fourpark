import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductComponent} from '@products/components/product/product.component';
import {HeaderComponent} from '@shared/components/header/header.component';
import {Product} from '@shared/models/product.model';
import {ProductService} from '@shared/services/product.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ProductComponent, HeaderComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  products = signal<Product[]>([]);
  private productService = inject(ProductService);

  ngOnInit() {
    this.productService.getProducts()
      .subscribe({
          next: (products) => {
            this.products.set(products);
          },
          error: () => {

          }
        }
      );
  }

  fromChild(event: string) {

  }
}
