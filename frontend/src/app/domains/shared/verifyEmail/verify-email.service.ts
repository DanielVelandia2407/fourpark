import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  private http = inject(HttpClient);

  constructor() { }

  postVerifyEmail(url: string) {
    return firstValueFrom(
      this.http.post<any>(url, {})
    );
  }
}
