import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faLock  } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgFor, FontAwesomeModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})

export class AdminUsersComponent {

  users : User[] = []

  faTrash = faTrash;
  faLock = faLock;
  faEdit  = faEdit;

  Delete(){
    console.log("Eleminiar")
  }

  Block(){
    console.log("Bloqueado")
  }

  Unlock(){
    console.log("Desbloqueado")
  }

  Edit() {
    console.log("Editar")
  }

  constructor(
    private dataService: DataService , 
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
