import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '@shared/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isAuthenticated()) {
      const userRole = this.tokenService.getUserRole();
      const expectedRole = route.data['role'] as string;

      if (expectedRole && userRole !== expectedRole) {
        this.router.navigate(['access-denied']);
        return false;
      }

      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
