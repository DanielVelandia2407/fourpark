import { Component } from '@angular/core';
import { DataService, Parking } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-parkings',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,RouterModule],
  templateUrl: './admin-parkings.component.html',
  styleUrl: './admin-parkings.component.css'
})
export class AdminParkingsComponent {
    
    faTrash = faTrash;
    faEdit = faEdit;

    Edit(){
      console.log("Editar")
      
    }

    GoToCreateWindows(){
      // Navegar a la nueva ruta, añadiendo el segmento
      this.router.navigate(["create"], { relativeTo: this.route });
    }


    Delete(id: number){
      console.log("Eliminar")
      Swal.fire({
        title: "¿Eliminar parqueadero?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {

          this.http.delete( environment.apiUrl + "/parkings/" + `${id}` ).subscribe(
            (options) =>{
              Swal.fire({
                title: "Eliminado!",
                text: "El parqueadero ha sido eliminado",
                icon: "success"
              });
              window.location.reload()
            },
            (error) => {
              Swal.fire({
                title: "Error!",
                text: "Error al eliminar usuario",
                icon: "warning"
              });
            }
          )

          
        }
      });
    }


    parkings: Parking[] = []

    constructor (private dataService: DataService, private http : HttpClient , private router: Router,  private route: ActivatedRoute){}
    
    
    ngOnInit(): void {
      this.dataService.getParkings().subscribe(
        (options: Parking[] ) => {
          this.parkings = options.sort((a, b) => a.id_parking - b.id_parking);
        },
        (error) => {
          console.error('Error al obtener opciones:', error);
        }
      );
    }
}
