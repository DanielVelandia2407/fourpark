import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private logoutTimer: any;
  private readonly inactivityDuration: number = 10 * 60 * 1000; // 10 minutos en milisegundos

  constructor(private router: Router) { }

  getDecodedToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    const decodedToken = this.getDecodedToken(token || '');
    return decodedToken ? decodedToken.role : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.getDecodedToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken && decodedToken.exp > currentTime;
    }
    return false;
  }

  isAuthenticated2(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); 
  }

  handleLogoutOnInactivity(): void {
    window.addEventListener('mousemove', this.resetLogoutTimer.bind(this));
    window.addEventListener('keydown', this.resetLogoutTimer.bind(this));
    this.startLogoutTimer();
  }

  private startLogoutTimer(): void {
    this.logoutTimer = setTimeout(() => {
      // Mostrar alerta al usuario
      window.alert('Su sesión se cerro debido a inactividad.');
      // Cerrar sesión
      this.logout();
    }, this.inactivityDuration);
  }

  private resetLogoutTimer(): void {
    clearTimeout(this.logoutTimer);
    this.startLogoutTimer();

  }
}
