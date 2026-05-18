import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '@shared/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isAuthenticated()) {
      return true;
    }

    // Redirigir a la página de inicio de sesión si no está autenticado
    this.router.navigate(['/inicio-nologueado']);
    return false;
  }
}
