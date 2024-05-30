import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
<<<<<<< HEAD
import { DataService, Parking, Schedule } from '../../../../services/admin/data.service';
=======
import { DataService, Parking } from '../../../../services/admin/data.service';
import { initFlowbite } from "flowbite";
import { TokenService } from '@shared/token/token.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { VnologueoComponent } from '@shared/components/vnologueo/vnologueo.component';
>>>>>>> cf619edec9f24ba0e254dc84559a18a717afb6cd

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HeaderComponent, VnologueoComponent],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 4.6482837, lng: -74.2478946 }; // Centrando en Bogotá
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  parkings: Parking[] = [];
  schedules: Schedule[] = [];
  selectedParking: Parking | null = null;

  // Variables para almacenar información del token
  rol: string;

  constructor(private dataService: DataService, private jwtService: TokenService) { }

  ngOnInit(): void {
<<<<<<< HEAD
    this.loadData();
=======
    this.loadParkings();

    this.jwtService.handleLogoutOnInactivity();

    initFlowbite();

      // Recuperación del token del localStorage
      const token = localStorage.getItem('token');

      if (token) {
        // Decodificación del token si existe
        const decodedToken = this.jwtService.getDecodedToken(token);
        this.rol = decodedToken.role;
      } else {
        console.log('No token found in local storage');
      }
>>>>>>> cf619edec9f24ba0e254dc84559a18a717afb6cd
  }

  loadData(): void {
    this.dataService.getParkings().subscribe((parkings: Parking[]) => {
      this.dataService.getOptionsSchedules().subscribe((schedules: Schedule[]) => {
        this.parkings = parkings.map(parking => {
          return parking;
        });
      });
    });
  }

  openInfoWindow(parking: Parking): void {
    this.selectedParking = parking;
  }

  closeInfoWindow(): void {
    this.selectedParking = null;
  }
}
