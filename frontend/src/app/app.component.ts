import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from "flowbite";
import { TokenService } from './domains/shared/token/token.service';
import { inject as injectAnalytics } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet/>',
})
export class AppComponent implements OnInit {
  title = 'parqueadero';

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    initFlowbite();
    this.tokenService.handleLogoutOnInactivity();
    injectAnalytics();
  }
}
