import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CounterComponent } from "@shared/components/counter/counter.component";
import { HeaderComponent } from "@shared/components/header/header.component";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CounterComponent,
        HeaderComponent,
        NgIf
    ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
