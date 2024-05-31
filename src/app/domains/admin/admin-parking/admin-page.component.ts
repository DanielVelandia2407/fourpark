import { Component, NgZone  } from '@angular/core';
import { City, Schedule, DataService, User } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';
import { GoogleMapsModule, MapMarker, GoogleMap  } from '@angular/google-maps'
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [HeaderComponent,NgFor, GoogleMapsModule, FormsModule, RouterModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

  typeParkings: { id_type_parking: number, name: string }[] = [];
  users : User[]=[];
  cities : City[] = [];
  schedules: Schedule[] = [];
  center: google.maps.LatLngLiteral = { lat : 0 , lng : 0};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];

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
    
    // Process form data (e.g., send to server)
    console.log('Form data:', data);
    const formData = new FormData();

    const fileInputElement =  document.getElementById('image_path') as HTMLInputElement;
    if (fileInputElement.files && fileInputElement.files.length > 0) {
      const selectedFile = fileInputElement.files[0];
      formData.append('image_path', selectedFile);
    }

    const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
    const latitudeElement = document.getElementById('latitude') as HTMLInputElement;    
    const addressElement = document.getElementById('address') as HTMLInputElement;

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', addressElement.value);
    formData.append('longitude', longitudeElement.value);
    formData.append('latitude', latitudeElement.value);
    formData.append('has_loyalty_service', "1");
    formData.append('is_active', "1");
    formData.append('id_type_parking_fk', data.id_type_parking);
    formData.append('id_user_fk', data.id_user_fk);
    formData.append('id_schedule_fk', data.id_schedule_fk);
    formData.append('id_city_fk', data.id_city_fk);


    alert('Form submitted successfully!');


    this.http.post(environment.apiUrl +"/parkings", formData)
      .subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          alert('¡Formulario enviado exitosamente!');
        },
        (error) => {
          console.log('Error al enviar formulario:', error);
          alert('Error al enviar formulario. Por favor, inténtalo de nuevo.');
        }
      );
}

  constructor(
    private dataService: DataService , 
    private _ngzone: NgZone, 
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
   
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
        this.users = options;
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
