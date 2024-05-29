import {Injectable} from '@angular/core';
import {firstValueFrom} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private http = inject(HttpClient);

  constructor() { }

  postRecoverPassword(url: string, formValue: any){
    return firstValueFrom(
      this.http.post<any>(url, formValue)
    )
  }
}
