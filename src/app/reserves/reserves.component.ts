import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  DataService,
  Parking,
  ParkingController,
} from '../services/admin/data.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapMarker, GoogleMap } from '@angular/google-maps';
import Swal from 'sweetalert2';

interface VehicleInfo {
  id: number;
  name: string;
  capacity: number;
  fee: number;
}

@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './reserves.component.html',
  styleUrls: ['./reserves.component.css'],
})
export class ReservesComponent implements OnInit {
  currentDate: Date = new Date();
  parking: Parking | null = null;
  availableVehicleInfo: VehicleInfo[] = [];
  selectedVehicleInfo: VehicleInfo | null = null;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  position: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const parkingId = Number(params.get('id'));
      if (parkingId) {
        this.dataService.getParkingById(parkingId).subscribe(
          (parking: Parking) => {
            this.parking = parking;
            this.center = this.position = {
              lng: parking.longitude,
              lat: parking.latitude,
            };
            // Obtener tipos de vehículos
            this.extractVehicleInfo(parking);
          },
          (error) => {
            console.error('Error al obtener el parqueadero', error);
          }
        );
      }
    });

    this.setupTimeInputs();
  }

  extractVehicleInfo(parking: Parking): void {
    this.availableVehicleInfo = parking.parking_controllers.map(
      (controller: ParkingController) => {
        return {
          id: controller.vehicles.id_vehicle,
          name: controller.vehicles.name,
          capacity: controller.capacity,
          fee: controller.fee,
        };
      }
    );
  }

  setupTimeInputs() {
    const yearInput: HTMLInputElement = document.getElementById(
      'resYear'
    ) as HTMLInputElement;
    const monthInput: HTMLInputElement = document.getElementById(
      'resMonth'
    ) as HTMLInputElement;
    const dayInput: HTMLInputElement = document.getElementById(
      'resDay'
    ) as HTMLInputElement;
    const startTimeInput: HTMLInputElement = document.getElementById(
      'resStart'
    ) as HTMLInputElement;
    const endTimeInput: HTMLInputElement = document.getElementById(
      'resEnd'
    ) as HTMLInputElement;

    yearInput.addEventListener('input', () => this.validateYear(yearInput));
    monthInput.addEventListener('input', () =>
      this.validateMonth(monthInput, yearInput)
    );
    dayInput.addEventListener('input', () =>
      this.validateDay(dayInput, monthInput, yearInput)
    );
    startTimeInput.addEventListener('input', () =>
      this.validateHour(startTimeInput)
    );
    endTimeInput.addEventListener('input', () =>
      this.validateHour(endTimeInput)
    );
  }

  validateYear(input: HTMLInputElement) {
    const currentYear = new Date().getFullYear();
    const year = parseInt(input.value, 10);
    if (!isNaN(year) && year < currentYear) {
      input.value = currentYear.toString();
    }
  }

  validateMonth(input: HTMLInputElement, yearInput: HTMLInputElement) {
    const month = parseInt(input.value, 10);
    if (!isNaN(month)) {
      if (month < 1) {
        input.value = '0';
      } else if (month > 12) {
        input.value = '12';
      }
    }

    this.validateDay(
      document.getElementById('resDay') as HTMLInputElement,
      input,
      yearInput
    );
  }

  validateDay(
    dayInput: HTMLInputElement,
    monthInput: HTMLInputElement,
    yearInput: HTMLInputElement
  ) {
    const month = parseInt(monthInput.value, 10);
    const year = parseInt(yearInput.value, 10);
    const day = parseInt(dayInput.value, 10);

    if (!isNaN(day)) {
      const daysInMonth = this.getDaysInMonth(month, year);
      if (day < 1) {
        dayInput.value = '0';
      } else if (day > daysInMonth) {
        dayInput.value = daysInMonth.toString();
      }
    }
  }

  validateHour(input: HTMLInputElement) {
    const hour = parseInt(input.value, 10);
    if (!isNaN(hour)) {
      if (hour < 1) {
        input.value = '1';
      } else if (hour > 24) {
        input.value = '24';
      }
    }
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  cancelReservation() {
    this.router.navigate(['/cancel-reserve']);
  }

  processReservation() {
    const yearInput: HTMLInputElement = document.getElementById(
      'resYear'
    ) as HTMLInputElement;
    const monthInput: HTMLInputElement = document.getElementById(
      'resMonth'
    ) as HTMLInputElement;
    const dayInput: HTMLInputElement = document.getElementById(
      'resDay'
    ) as HTMLInputElement;
    const startTimeInput: HTMLInputElement = document.getElementById(
      'resStart'
    ) as HTMLInputElement;
    const endTimeInput: HTMLInputElement = document.getElementById(
      'resEnd'
    ) as HTMLInputElement;
    const vehicleTypeInput: HTMLSelectElement = document.getElementById(
      'vehicleType'
    ) as HTMLSelectElement;
    const licensePlateInput: HTMLInputElement = document.getElementById(
      'licensePlate'
    ) as HTMLInputElement;
    const paymentMethodInput: HTMLSelectElement = document.getElementById(
      'resPayMethod'
    ) as HTMLSelectElement;

    const reservationDate = `${yearInput.value}-${monthInput.value.padStart(
      2,
      '0'
    )}-${dayInput.value.padStart(2, '0')}`;
    const entryReservationDate = parseInt(startTimeInput.value, 10);
    const departureReservationDate = parseInt(endTimeInput.value, 10);
    const idVehicleFk = parseInt(vehicleTypeInput.value, 10);
    const idParkingFk = this.parking ? this.parking.id_parking : 0;
    const idPaymentMethodFk = parseInt(paymentMethodInput.value, 10);
    const vehicleCode = licensePlateInput.value;

    const reservationData = {
      reservation_date: reservationDate,
      entry_reservation_date: entryReservationDate,
      departure_reservation_date: departureReservationDate,
      id_vehicle_fk: idVehicleFk,
      id_parking_fk: idParkingFk,
      id_payment_method_fk: idPaymentMethodFk,
      vehicle_code: vehicleCode,
    };

    if (idPaymentMethodFk === 1) {
      this.router.navigate(['/pasarela'], { state: { reservationData } });
    } else if (idPaymentMethodFk === 2) {
      this.http
        .post(
          'https://fourparkscolombia.onrender.com/api/reservations',
          reservationData
        )
        .subscribe(
          (response: any) => {
            console.log('Reserva exitosa', response);
            this.router.navigate(['/points-reserve']);
          },
          (error) => {
            console.error('Error al realizar la reserva', error);
            Swal.fire('Error al realizar la reserva');
          }
        );
    } else if (idPaymentMethodFk === 3) {
      this.http
        .post(
          'https://fourparkscolombia.onrender.com/api/reservations',
          reservationData
        )
        .subscribe(
          (response: any) => {
            console.log('Reserva exitosa', response);
            if (response.url) {
              window.location.href = response.url;
            } else {
              Swal.fire('Reserva exitosa, pero no se recibió URL de redirección.');
            }
          },
          (error) => {
            console.error('Error al realizar la reserva', error);
            Swal.fire('Error al realizar la reserva');
          }
        );
    } else {
      Swal.fire('Error en la reservación.');
    }
  }
}
