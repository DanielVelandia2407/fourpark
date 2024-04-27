import { Component, Input, SimpleChange, inject, signal, OnInit} from '@angular/core';
import { CommonModule } from "@angular/common";
import { Product } from "@shared/models/product.model";
import { RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { initFlowbite } from "flowbite";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
    ngOnInit() {
    initFlowbite();
  }

}
