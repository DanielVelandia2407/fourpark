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


  GoToCreate(){
    document.location.href = "/admin/admins/create"
  }

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
    document.location.href = "/admin/admins/edit/" + `${id}`
  }

  constructor(
    private dataService: DataService
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
