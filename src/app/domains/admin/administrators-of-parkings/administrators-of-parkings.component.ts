import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor, CommonModule, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock, faUnlock, faTimes, faCheck  } from '@fortawesome/free-solid-svg-icons';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

export interface UserEdit {
  first_name: string;
  last_name: string;
  user_name: string;
  identification_card: string;
  id_user : string;
}




@Component({
  selector: 'app-administrators-of-parkings',
  standalone: true,
  imports: [HeaderComponent,RouterModule ,NgFor, FontAwesomeModule,NgIf],
  templateUrl: './administrators-of-parkings.component.html',
  styleUrl: './administrators-of-parkings.component.css'
})
export class AdministratorsOfParkingsComponent {
  users : User[] = []

  faTrash = faTrash;
  faLock = faLock;
  faEdit  = faEdit;
  faUnlock = faUnlock; 
  faTimes=faTimes;
  faCheck=faCheck;


  GoToCreate(){
    document.location.href = "/admin/admins/create"
  }

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
    private dataService: DataService,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.dataService.getOptionsUsers().subscribe(
      (options: User[]) => {
          this.users = options
              .filter(user =>[2, 3].includes(user.id_role_fk)) // Filtrar por id_role_fk igual a 2
              .sort((a, b) => a.id_user - b.id_user); // Ordenar por id_user
      },
      (error) => {
          console.error('Error al obtener opciones:', error);
      }
  );
  }
}
