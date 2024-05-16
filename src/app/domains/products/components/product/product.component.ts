import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() id_parking: number = 0;
  @Input() name: string = '';
  @Input() address: string = '';
  @Input() image_path: string = '';

  @Output() addToCart = new EventEmitter();

  addToCartHandler() {
    this.addToCart.emit();
  }
}
