import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor, CommonModule,NgIf} from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock, faUnlock  } from '@fortawesome/free-solid-svg-icons';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
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
}



@Component({
  selector: 'edit-user-admin',
  standalone: true,
  imports: [],
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

    const updatedUser: Partial<UserEdit> = {
        user_name: user_nameInput.value,
        first_name: first_nameInput.value,
        last_name: last_nameInput.value,
        identification_card: identification_cardInput.value
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

  Delete(){
    console.log("Eleminiar")
  }

  Block(){
    console.log("Bloqueado")
  }

  Unlock(){
    console.log("Desbloqueado")
  }

  Edit(id: number) {
    document.location.href = "/admin/users/edit/" + `${id}`
  }

  constructor(
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.dataService.getOptionsUsers().subscribe(
      (options: User[] ) => {
        this.users = options.sort((a, b) => a.id_user - b.id_user);
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );
  }
}
