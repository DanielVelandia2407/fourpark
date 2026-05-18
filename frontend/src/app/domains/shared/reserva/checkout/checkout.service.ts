import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'https://fourparkscolombia.onrender.com/api/check-out';

  constructor(private http: HttpClient) { }

  checkOutReservation(reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.put(url, null);
  }
}