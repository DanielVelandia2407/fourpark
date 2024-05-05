import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from "flowbite";
import { AuthInterceptor } from './auth/interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  template: '<router-outlet/>'
})
export class AppComponent implements OnInit {
  title = 'parqueadero';

  ngOnInit() {
    initFlowbite();
  }
}
