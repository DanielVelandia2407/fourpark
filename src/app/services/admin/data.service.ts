import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {pasarelaI} from '../../../app/domains/shared/models/pasarela.interface'

export interface User {
    id_user : number
    first_name: string;
    last_name: string;
    user_name: string;
    mail: string;
  }

export interface City {
    id_city : number,
    name : String
}

export interface Schedule {
    id_schedule: number,
    name: String
}

export interface Card{

  id_card: number;
  number: string;
  cvc: string;
  expiration_date: string;
  id_user_fk: number;

}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getOptionsTypeParkings(): Observable< { id_type_parking: number, name: string }[]> {
    return this.http.get< { id_type_parking: number, name: string }[]>(environment.apiUrl + '/types-parking/');
  }

  getOptionsUsers(): Observable< User[]> {
    return this.http.get< User[]>(environment.apiUrl + '/users');
  }

  getOptionsCities(): Observable< City[]> {
    return this.http.get< City[]>(environment.apiUrl + '/cities');
  }

  getOptionsSchedules(): Observable< Schedule[]> {
    return this.http.get< Schedule[]>(environment.apiUrl + '/schedules');
  }

  getOptionsCards(): Observable<Card> {

    return this.http.get<Card>(environment.apiUrl +'/card');
  }

}