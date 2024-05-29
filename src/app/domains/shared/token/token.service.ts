import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

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
  }
}
