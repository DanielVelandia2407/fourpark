import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { DataService, Parking } from '../../../../services/admin/data.service';
import { initFlowbite } from "flowbite";
import { TokenService } from '@shared/token/token.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { VnologueoComponent } from '@shared/components/vnologueo/vnologueo.component';

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
  selectedParking: Parking | null = null;

  // Variables para almacenar información del token
  rol: string;

  constructor(private dataService: DataService, private jwtService: TokenService) { }

  ngOnInit(): void {
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
  }

  loadParkings(): void {
    this.dataService.getParkings().subscribe((data: Parking[]) => {
      this.parkings = data;
    });
  }

  openInfoWindow(parking: Parking): void {
    this.selectedParking = parking;
  }
}
