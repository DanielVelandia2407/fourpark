import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = environment.apiUrl + '/card';

  constructor(private http: HttpClient) { }

  updateCard(card: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.apiUrl, card, { headers: headers });
  }
}
