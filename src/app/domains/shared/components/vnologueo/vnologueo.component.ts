import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLinkWithHref, RouterLinkActive, Router } from "@angular/router";
import { ListComponent } from '@products/pages/list/list.component';

@Component({
  selector: 'app-vnologueo',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, RouterLinkActive, ListComponent],
  templateUrl: './vnologueo.component.html',
  styleUrl: './vnologueo.component.css'
})
export class VnologueoComponent {

}
