import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor, CommonModule, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock, faUnlock  } from '@fortawesome/free-solid-svg-icons';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface UserEdit {
  first_name: string;
  last_name: string;
  user_name: string;
  identification_card: string;
  id_user : string;
  loyalty_points: number,
  password : string,
  mail: string,
  role : string
}

@Component({
  selector: 'app-register-administrator',
  templateUrl: './register-administrator.component.html',
  styleUrls: ['./register-administrator.component.css'],
  imports : [],
  standalone: true
})
export class RegisterAdministratorComponent {
  user:  UserEdit
  
  updateUserAPI(updatedUser: Partial<UserEdit>): Observable<any>{
      const url = environment.apiUrl + '/register-administrator' ;
      console.log("Por aqui pase")
      
      return this.http.post<any>(url, updatedUser)
  }

  updateUser(): void{

    const user_nameInput = document.getElementById('user_name') as HTMLInputElement;
    const first_nameInput = document.getElementById('first_name') as HTMLInputElement;
    const last_nameInput = document.getElementById('last_name') as HTMLInputElement;
    const identification_cardInput = document.getElementById('identification_card') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const email = document.getElementById('mail') as HTMLInputElement;

    const updatedUser: Partial<UserEdit> = {
        user_name: user_nameInput.value,
        first_name: first_nameInput.value,
        last_name: last_nameInput.value,
        identification_card: identification_cardInput.value,
        password : password.value,
        mail :  email.value,
        role :  "Administrador"
    };

    this.updateUserAPI(updatedUser).subscribe(
      (data) =>{
        document.location.href = '/admin/admins/'
      },
      (error) =>{
        console.log("error al actualizar")
      }
    );

  }

  public constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
  ){}
  
  ngOnInit(): void {
    
  }
}