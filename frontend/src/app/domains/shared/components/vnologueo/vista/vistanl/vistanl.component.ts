import { Component } from '@angular/core';
import { ListComponent } from '@products/pages/list/list.component';
import { VnologueoComponent } from '../../vnologueo.component';

@Component({
  selector: 'app-vistanl',
  standalone: true,
  imports: [ListComponent, VnologueoComponent],
  templateUrl: './vistanl.component.html',
  styleUrl: './vistanl.component.css'
})
export class VistanlComponent {

}
