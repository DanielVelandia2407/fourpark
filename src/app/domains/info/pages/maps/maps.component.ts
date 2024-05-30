import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { DataService, Parking } from '../../../../services/admin/data.service';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 4.6482837, lng: -74.2478946 }; // Centrando en Bogotá
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  parkings: Parking[] = [];
  selectedParking: Parking | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadParkings();
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
