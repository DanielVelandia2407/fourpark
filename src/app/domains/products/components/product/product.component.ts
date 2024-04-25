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
  @Input() id_parqueadero: number = 0;
  @Input() nombre: string = '';
  @Input() direccion: string = '';
  @Input() image_path: string = '';

  @Output() addToCart = new EventEmitter();

  addToCartHandler() {
    this.addToCart.emit();
  }
}
