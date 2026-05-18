import { Component } from '@angular/core';
import { DataService, Parking, City, Schedule,User  } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faTimes  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { GoogleMapsModule, MapMarker, GoogleMap  } from '@angular/google-maps'
import { FormsModule }   from '@angular/forms';



@Component({
  selector: 'app-edit-admin-parkings',
  standalone: true,
  imports: [HeaderComponent, NgFor,FontAwesomeModule,RouterModule,GoogleMapsModule,FormsModule],
  templateUrl: './edit-admin-parkings.component.html',
  styleUrl: './edit-admin-parkings.component.css'
})
export class AdminParkingsEditComponent {

  faTimes = faTimes;

  redirect(){
    document.location.href = "/admin/parkings/"
  }


  typeParkings: { id_type_parking: number, name: string }[] = [];
  users : User[]=[];
  cities : City[] = [];
  schedules: Schedule[] = [];
  center: google.maps.LatLngLiteral = { lat : 0 , lng : 0};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  parking : Parking;

  formData: any = {};

  addMarker(event: google.maps.MapMouseEvent) {
    
    this.markerPositions =[]
    event.latLng? this.markerPositions.push(event.latLng.toJSON()): console.log("No hay posicion")
    



    

    if (event.latLng){
      const longitudeElement = document.getElementById('longitude') as HTMLInputElement; //longitude
      const latitudeElement = document.getElementById('latitude') as HTMLInputElement;

      if (longitudeElement && latitudeElement) {
        longitudeElement.value = event.latLng.lng().toString(); // Mostrar longitud
        latitudeElement.value = event.latLng.lat().toString(); // Mostrar latitud
        
        longitudeElement.disabled = false
        latitudeElement.disabled = false

      }

      const formData = new FormData();
      formData.append('lat', event.latLng.lat().toString());
      formData.append('lon', event.latLng.lng().toString());


      const lat = event.latLng.lat().toString();
      const lon = event.latLng.lng().toString();


      this.http.get(environment.apiUrl + `/address?lat=${lat}&lon=${lon}`).subscribe(
        (data : { address?: string }) => {
          const addressElement = document.getElementById('address') as HTMLInputElement;
          if (addressElement && data && data.address) {
            addressElement.value = data.address;
            addressElement.disabled = false
          }
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );

    }


    

  }


  onSubmit(data: any) {
    const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
    const latitudeElement  = document.getElementById('latitude')  as HTMLInputElement;
    const addressElement   = document.getElementById('address')   as HTMLInputElement;

    const payload = {
      name:                data.name,
      description:         data.description,
      address:             addressElement.value,
      longitude:           parseFloat(longitudeElement.value),
      latitude:            parseFloat(latitudeElement.value),
      image_path:          data.image_path || null,
      has_loyalty_service: data.has_loyalty_service,
      is_active:           data.is_active,
      id_type_parking_fk:  data.id_type_parking,
      id_user_fk:          data.id_user_fk,
      id_schedule_fk:      data.id_schedule_fk,
      id_city_fk:          data.id_city_fk,
      car_capacity:        parseFloat((document.getElementById('capacity_2') as HTMLInputElement).value) || 0,
      car_fee:             parseFloat((document.getElementById('fee_2')      as HTMLInputElement).value) || 0,
      motorbike_capacity:  parseFloat((document.getElementById('capacity_1') as HTMLInputElement).value) || 0,
      motorbike_fee:       parseFloat((document.getElementById('fee_1')      as HTMLInputElement).value) || 0,
      bicycle_capacity:    parseFloat((document.getElementById('capacity_3') as HTMLInputElement).value) || 0,
      bicycle_fee:         parseFloat((document.getElementById('fee_3')      as HTMLInputElement).value) || 0,
    };


    this.http.put(environment.apiUrl + '/parkings/' + this.parking.id_parking, payload)
      .subscribe(
        (response) => {
          Swal.fire('Parqueadero actualizado correctamente');
          document.location.href = '/admin/parkings';
        },
        (error) => {
          console.error('Error al actualizar parqueadero:', error);
          Swal.fire('Error al actualizar parqueadero. Por favor, inténtalo de nuevo.');
        }
      );
  }

  constructor(
    private dataService: DataService , 
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}
  
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const parkingId = Number(params.get('id'));
      if (parkingId){
        this.dataService.getParkingById(parkingId).subscribe(
          (data) =>{
            this.parking = data
            console.log(this.parking)
          }
        )
      }
      else {
          document.location.href = "/"
      }
    })
   
    navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    
    this.dataService.getOptionsTypeParkings().subscribe(
      (options: { id_type_parking: number, name: string }[] ) => {
        this.typeParkings = options;
        // console.log(this.typeParkings)
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );

    this.dataService.getOptionsUsers().subscribe(
      (options: User[] ) => {
        this.users = options.filter(user => user.id_role_fk === 2);;
        // console.log(this.typeParkings)
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );

    this.dataService.getOptionsCities().subscribe(
      (options: City[] ) => {
        this.cities = options;
        // console.log(this.typeParkings)
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );

    this.dataService.getOptionsSchedules().subscribe(
      (options: Schedule[] ) => {
        this.schedules = options;
        // console.log(this.typeParkings)
      },
      (error) => {
        console.error('Error al obtener opciones:', error);
      }
    );

  }

  

}

@Component({
  selector: 'app-admin-parkings',
  standalone: true,
  imports: [HeaderComponent,NgFor, FontAwesomeModule,RouterModule],
  templateUrl: './admin-parkings.component.html',
  styleUrl: './admin-parkings.component.css'
})
export class AdminParkingsComponent {
    
    faTrash = faTrash;
    faEdit = faEdit;

    Edit(id: number){
      document.location.href = "/admin/parkings/edit/" + id
      
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
