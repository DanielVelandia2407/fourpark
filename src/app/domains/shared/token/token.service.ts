import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Temporizador para el cierre de sesión por inactividad
  private logoutTimer: any;

  // Duración de inactividad en milisegundos (10 minutos)
  private readonly inactivityDuration: number = 10 * 60 * 1000;

  constructor(private router: Router) { }

  
  // Decodifica un token JWT.
  getDecodedToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  /**
   * Obtiene el token almacenado en localStorage.
   * retorna El token JWT o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtiene el rol del usuario a partir del token decodificado.
   * retorna El rol del usuario o null si no se puede obtener.
   */
  getUserRole(): string | null {
    const token = this.getToken();
    const decodedToken = this.getDecodedToken(token || '');
    return decodedToken ? decodedToken.role : null;
  }

  /**
   * Verifica si el usuario está autenticado comprobando la validez del token.
   * retorna true si el usuario está autenticado, false en caso contrario.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.getDecodedToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken && decodedToken.exp > currentTime;
    }
    return false;
  }

  /**
   * Verifica si el usuario está autenticado comprobando la existencia del token.
   * @returns true si el token existe, false en caso contrario.
   */
  isAuthenticated2(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  /**
   * Cierra la sesión del usuario eliminando el token y redirigiendo a la página de inicio de sesión.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /**
   * Configura el manejo del cierre de sesión por inactividad.
   */
  handleLogoutOnInactivity(): void {
    window.addEventListener('mousemove', this.resetLogoutTimer.bind(this));
    window.addEventListener('keydown', this.resetLogoutTimer.bind(this));
    this.startLogoutTimer();
  }

  /**
   * Inicia el temporizador de cierre de sesión por inactividad.
   * Muestra una alerta al usuario y cierra la sesión si se alcanza la duración de inactividad.
   */
  private startLogoutTimer(): void {
    this.logoutTimer = setTimeout(() => {
      // Mostrar alerta al usuario
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Su sesión se cerró debido a inactividad.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      });
      
    }, this.inactivityDuration);
  }

  /**
   * Reinicia el temporizador de cierre de sesión por inactividad.
   * Se llama cuando se detecta actividad del usuario.
   */
  private resetLogoutTimer(): void {
    clearTimeout(this.logoutTimer);
    this.startLogoutTimer();
  }
}
