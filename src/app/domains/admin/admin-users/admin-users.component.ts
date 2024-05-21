import { Component } from '@angular/core';
import { DataService, User } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';


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
  faEdit = faEdit;

  Edit(){
    console.log("Editar")
  }

  Delete(){
    console.log("Eliminar")
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
