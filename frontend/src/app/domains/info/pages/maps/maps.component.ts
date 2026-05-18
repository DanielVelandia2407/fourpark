import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { DataService, Parking } from '../../../../services/admin/data.service';
import { initFlowbite } from 'flowbite';
import { TokenService } from '@shared/token/token.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { VnologueoComponent } from '@shared/components/vnologueo/vnologueo.component';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule, HeaderComponent, VnologueoComponent],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 4.6482837, lng: -74.2478946 };
  zoom = 6;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  parkings: Parking[] = [];
  selectedParking: Parking | null = null;
  searchTerm = '';
  rol: string = '';

  constructor(
    private dataService: DataService,
    private jwtService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    initFlowbite();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.jwtService.getDecodedToken(token);
      this.rol = decoded?.role ?? '';
    }

    this.dataService.getParkings().subscribe((data: Parking[]) => {
      this.parkings = data;
    });
  }

  get filteredParkings(): Parking[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.parkings;
    return this.parkings.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.cities?.name?.toLowerCase().includes(term)
    );
  }

  selectParking(parking: Parking): void {
    this.selectedParking = parking;
    this.center = { lat: parking.latitude, lng: parking.longitude };
    this.zoom = 15;
  }

  closeInfoWindow(): void {
    this.selectedParking = null;
    this.zoom = 6;
    this.center = { lat: 4.6482837, lng: -74.2478946 };
  }

  goToReserve(id: number): void {
    this.router.navigate(['/reserves', id]);
  }
}
