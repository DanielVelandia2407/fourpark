import { Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from "flowbite";
import { TokenService } from '@shared/token/token.service';

import { CounterComponent } from './../../../shared/components/counter/counter.component';
import {HeaderComponent} from "@shared/components/header/header.component";
import { VnologueoComponent } from '@shared/components/vnologueo/vnologueo.component';

@Component({
  selector: 'app-about',
  standalone: true,
    imports: [CommonModule, CounterComponent, HeaderComponent, VnologueoComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})

export class AboutComponent {

  // Variables para almacenar información del token
  idUsuario: number;
  rol: string;
  iat: number;
  exp: number;
  name: string;

  duration = signal(1000);
  message = signal('Hello World');

  constructor(private jwtService: TokenService) { }

  changeDuration(event: Event) {
    const input = event.target as HTMLInputElement;
    this.duration.set(input.valueAsNumber);
  }

  changeMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message.set(input.value);
  }

  ngOnInit() {

    this.jwtService.handleLogoutOnInactivity();

    initFlowbite();

        // Recuperación del token del localStorage
        const token = localStorage.getItem('token');

        if (token) {
          // Decodificación del token si existe
          const decodedToken = this.jwtService.getDecodedToken(token);
          this.idUsuario = decodedToken.id_user;
          this.rol = decodedToken.role;
          this.iat = decodedToken.iat;
          this.exp = decodedToken.exp;
          this.name = decodedToken.user_name;
        } else {
          console.log('No token found in local storage');
        }
  }

}
