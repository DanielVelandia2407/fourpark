import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { DataService, Parking, Schedule } from '../../../../services/admin/data.service';

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
  schedules: Schedule[] = [];
  selectedParking: Parking | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadData();
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
