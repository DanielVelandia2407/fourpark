import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private apiUrl = 'https://fourparkscolombia.onrender.com/api/check-in';

  constructor(private http: HttpClient) { }

  checkinReservation(reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.put(url, null);
  }
}