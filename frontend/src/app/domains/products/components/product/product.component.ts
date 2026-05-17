import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '@shared/token/token.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.tokenService.handleLogoutOnInactivity();
  }

  @Input() id_parking: number = 0;
  @Input() name: string = '';
  @Input() address: string = '';
  @Input() image_path: string = '';
  @Input() is_active: boolean = false;

  @Output() addToCart = new EventEmitter();

  addToCartHandler() {
    this.addToCart.emit();
  }
}
