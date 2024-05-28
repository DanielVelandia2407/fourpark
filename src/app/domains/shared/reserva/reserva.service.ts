import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://fourparkscolombia.onrender.com/api/cancel-reservation';

  constructor(private http: HttpClient) { }

  cancelReservation(reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.put(url, null);
  }
}