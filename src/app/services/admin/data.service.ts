import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {pasarelaI} from '../../../app/domains/shared/models/pasarela.interface'

interface TypeParking {
  id_type_parking: number;
  name: string;
  // Otros campos de la tabla `types_parking`
}

export interface UserControler {
  is_account_blocked: Boolean
}

export interface User {
    id_user : number
    first_name: string;
    last_name: string;
    user_name: string;
    mail: string;
    user_controllers : UserControler;
    id_role_fk: number;
  }

export interface City {
    id_city : number,
    name : String
}

export interface Schedule {
    id_schedule: number,
    name: String
}

export interface Vehicle {
  id_vehicle: number;
  name: string;
}
export interface ParkingController {
  id_parking_controller: number;
  capacity: number;
  fee: number;
  id_vehicle_fk: number;
  id_parking_fk: number;
  vehicles: Vehicle;
}
export interface Parking {
  id_parking: number;
  name: string;
  description?: string;
  address: string;
  longitude: number;
  latitude: number;
  image_path: string;
  has_loyalty_service?: boolean;
  is_active?: boolean;
  id_city_fk: number;
  id_type_parking_fk: number;
  id_schedule_fk: number;
  id_user_fk?: number;

  cities: City;
  types_parking: TypeParking;
  schedules: Schedule;
  users?: User;

  parking_controllers: ParkingController[];
}

export interface Card{

  id_card: number;
  number: string;
  cvc: string;
  expiration_date: string;
  id_user_fk: number;

}

export interface Reservations {
  id_reservation: number;
  reservation_date: string;
  entry_reservation_date: string;
  departure_reservation_date: string;
  check_in: string | null;
  check_out: string | null;
  vehicle_code: string;
  state: string;
  id_vehicle_fk: number;
  id_user_fk: number;
  id_parking_fk: number;
  users: {
    user_name: string;
  };
  parkings: {
    name: string;
    has_loyalty_service: boolean;
    image_path: string;
  };
  vehicles: {
    name: string;
  };
  invoices: {
    id_invoice: number;
    reserve_amount: number;
    service_amount: number;
    extra_time_amount: number;
    refund_amount: number;
    total_amount: number;
    time: number;
    payment_token: string;
    id_payment_method_fk: number;
    id_reservation_fk: number;
  };
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


  getParkings(): Observable< Parking[]>{
    return this.http.get< Parking[]>(environment.apiUrl + '/parkings');
  }


  getOptionsCards(): Observable<Card> {
    return this.http.get<Card>(environment.apiUrl +'/card');
  }

  getParkingById(id: number): Observable<Parking> {
    return this.http.get<Parking>(`${environment.apiUrl}/parkings/${id}`);
  }
  
  getOptionsReservation(): Observable<Reservations[]>{
    return this.http.get<Reservations[]>(environment.apiUrl + '/reservations');
  }

}
