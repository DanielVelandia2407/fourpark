import { Component } from '@angular/core';
import { DataService, User } from '../../services/admin/data.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock, faUnlock, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '@shared/components/header/header.component';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';



export interface UserEdit {
  first_name: string;
  last_name: string;
  user_name: string;
  identification_card: string;
  id_user : string;
  loyalties : {
    loyalty_points : string 
  },
  loyalty_points : number
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  user:  UserEdit
  
  updateUserAPI(updatedUser: Partial<UserEdit>): Observable<any>{
      const url = environment.apiUrl + '/update-user';
      console.log("Por aqui pase")
      
      return this.http.put<any>(url, updatedUser)
  }

  updateUser(id: string): void{

    const user_nameInput = document.getElementById('user_name') as HTMLInputElement;
    const first_nameInput = document.getElementById('first_name') as HTMLInputElement;
    const last_nameInput = document.getElementById('last_name') as HTMLInputElement;
    const identification_cardInput = document.getElementById('identification_card') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    const updatedUser: Partial<UserEdit> = {
        user_name: user_nameInput.value,
        first_name: first_nameInput.value,
        last_name: last_nameInput.value,
        identification_card: identification_cardInput.value,
    };


    

    this.updateUserAPI(updatedUser).subscribe(
      (data) =>{
        Swal.fire("Usuario actualizado")
      },
      (error) =>{
        console.log("error al actualizar")
      }
    );

    if(password.value){
      this.http.put(environment.apiUrl + '/update-password', {password : password.value}).subscribe(
        (data)=>{
          
        },
        (error)=>{
          Swal.fire("Error actualizando contraseña, asegurate de  cumplir con los requerimientos")
        }
      )
    }

  }

  public constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
  ){}
  
  ngOnInit(): void {
    
        this.http.get<UserEdit>(environment.apiUrl + "/user" ).subscribe(
          (user: UserEdit) =>{
            this.user = user
          }
        )
      
  }
}
