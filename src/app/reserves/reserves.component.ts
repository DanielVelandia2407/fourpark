import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Parking } from '../services/admin/data.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapMarker, GoogleMap  } from '@angular/google-maps'



@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './reserves.component.html',
  styleUrls: ['./reserves.component.css']
})
export class ReservesComponent implements OnInit {

  parking: Parking | null = null;
  center: google.maps.LatLngLiteral = { lat : 0 , lng : 0};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  position: google.maps.LatLngLiteral = { lat : 0 , lng : 0};

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const parkingId = Number(params.get('id'));
      if (parkingId) {
        this.dataService.getParkingById(parkingId).subscribe(
          (parking: Parking) => {
            this.parking = parking;
            this.center = this.position = { lng: parking.longitude, lat: parking.latitude };
          },
          (error) => {
            console.error('Error al obtener el parqueadero', error);
          }
        );
      }
    });

    this.setupTimeInputs();
  }

  setupTimeInputs() {
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      input.addEventListener('input', function(this: HTMLInputElement, event) {
        let value = this.value;

        // Verificar si el valor contiene solo números
        if (/^\d+$/.test(value)) {
          // Convertir el valor a un número entero
          let hours = parseInt(value, 10);

          // Si se han ingresado más de dos dígitos para las horas, eliminar el último dígito ingresado
          if (value.length > 2) {
            this.value = value.substring(0, value.length - 1);
          }

          // Si las horas son mayores a 24, cambiar el valor a 24
          if (hours > 24) {
            this.value = '24';
          }
        } else {
          // Si el valor no es un número entero, eliminar el último carácter ingresado
          this.value = value.substring(0, value.length - 1);
        }
      });
    });
  }
}
