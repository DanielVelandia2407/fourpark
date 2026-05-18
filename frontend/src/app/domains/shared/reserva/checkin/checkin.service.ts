import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private apiUrl = environment.apiUrl + '/check-in';

  constructor(private http: HttpClient) { }

  checkinReservation(reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.put(url, null);
  }
}