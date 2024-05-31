import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor, CommonModule,NgIf} from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock, faUnlock, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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
  selector: 'edit-user-admin',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './edit-user-admin.component.html',
  styleUrl: './edit-user-admin.component.css'
})
export class EditUserAdminComponent {
  user:  UserEdit
  
  updateUserAPI(id: string, updatedUser: Partial<UserEdit>): Observable<any>{
      const url = environment.apiUrl + '/update-user/' + `${id}`;
      console.log("Por aqui pase")
      
      return this.http.put<any>(url, updatedUser)
  }

  updateUser(id: string): void{

    const user_nameInput = document.getElementById('user_name') as HTMLInputElement;
    const first_nameInput = document.getElementById('first_name') as HTMLInputElement;
    const last_nameInput = document.getElementById('last_name') as HTMLInputElement;
    const identification_cardInput = document.getElementById('identification_card') as HTMLInputElement;
    const loyalty_points = document.getElementById('loyalty_points') as HTMLInputElement;

    const updatedUser: Partial<UserEdit> = {
        user_name: user_nameInput.value,
        first_name: first_nameInput.value,
        last_name: last_nameInput.value,
        identification_card: identification_cardInput.value,
        loyalty_points : parseInt(loyalty_points.value) ,
    };

    this.updateUserAPI(id, updatedUser).subscribe(
      (data) =>{
        document.location.href = '/admin/users/'
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
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      if (userId){
        this.http.get<UserEdit>(environment.apiUrl + "/users/" + `${userId}`).subscribe(
          (user: UserEdit) =>{
            this.user = user
          }
        )
      }
      else {
          document.location.href = "/"
      }
    })
  }
}


@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterModule ,NgFor, FontAwesomeModule, NgIf],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})

export class AdminUsersComponent {

  users : User[] = []

  faTrash = faTrash;
  faLock = faLock;
  faEdit  = faEdit;
  faUnlock = faUnlock; 
  faCheck = faCheck;
  faTimes = faTimes;

  Delete(){
    console.log("Eleminiar")
  }


  DeActivate(user : User){
    Swal.fire({
      title: "¿Desactivar Usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Desactivar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put( environment.apiUrl + "/update-user/" + user.id_user, { ...user ,is_active : false} ).subscribe(
          (options) =>{
            Swal.fire({
              title: "Desactivado!",
              text: "El usuario ha sido desctivado",
              icon: "success"
            });
            window.location.reload()
          },
          (error) => {
            Swal.fire({
              title: "Error!",
              text: "Error al desactivar usuario",
              icon: "warning"
            });
          }
        )

        
      }
    });
  }


  Activate(user : User){
    Swal.fire({
      title: "¿Activar Usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Activar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.put( environment.apiUrl + "/update-user/" + user.id_user, { ...user ,is_active : true} ).subscribe(
          (options) =>{
            Swal.fire({
              title: "Activado!",
              text: "El usuario ha sido Activado",
              icon: "success"
            });
            window.location.reload()
          },
          (error) => {
            Swal.fire({
              title: "Error!",
              text: "Error al Activar usuario",
              icon: "warning"
            });
          }
        )

        
      }
    });
  }


  Unlock(id : number){
    Swal.fire({
      title: "¿Desbloquear Usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Desbloquear"
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.put( environment.apiUrl + "/unlock-user/" + id, {} ).subscribe(
          (options) =>{
            Swal.fire({
              title: "Desbloqueadeo!",
              text: "El usuario ha sido Desbloqueado",
              icon: "success"
            });
            window.location.reload()
          },
          (error) => {
            Swal.fire({
              title: "Error!",
              text: "Error al Desbloquear usuario",
              icon: "warning"
            });
          }
        )

        
      }
    });
    console.log("Desbloqueado")
  }

  Edit(id: number) {
    document.location.href = "/admin/users/edit/" + `${id}`
  }

  constructor(
    private dataService: DataService, private http: HttpClient,
  ){}

  ngOnInit(): void {
    this.dataService.getOptionsUsers().subscribe(
      (options: User[] ) => {
        
        this.users = options
        .filter(user => user.id_role_fk === 1)
        .sort((a, b) => a.id_user - b.id_user);
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );
  }
}
