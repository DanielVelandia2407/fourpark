import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLinkWithHref, RouterLinkActive, Router } from "@angular/router";
import { initFlowbite } from "flowbite";
import { TokenService } from '@shared/token/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // Variables para almacenar información del token
  idUsuario: number;
  rol: string;
  iat: number;
  exp: number;
  name: string;

  constructor(private router: Router, private jwtService: TokenService) { }

  logout(): void {
    this.jwtService.logout();
    this.router.navigate(['/login']);
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