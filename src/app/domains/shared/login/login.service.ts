import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private http = inject(HttpClient);

  constructor() { }

    postLogin(formValue: any){
    return firstValueFrom(
      this.http.post<any>(environment.apiUrl + '/login', formValue)
    )
  }
}
