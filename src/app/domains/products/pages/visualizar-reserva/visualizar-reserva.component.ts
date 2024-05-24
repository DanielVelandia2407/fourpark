import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { DataService } from '../../../../services/admin/data.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule para usar ngModel

@Component({
  selector: 'app-visualizar-reserva',
  standalone: true,
  imports: [HeaderComponent, CommonModule, DatePipe, FormsModule],
  templateUrl: './visualizar-reserva.component.html',
  styleUrls: ['./visualizar-reserva.component.css']
})
export class VisualizarReservaComponent implements OnInit {

  private apiUrl = 'https://fourparkscolombia.onrender.com/api/invoice-mail';
  reservations: any[] = [];
  filteredReservations: any[] = [];
  selectedState: string = 'Todos'; // Variable para almacenar el estado seleccionado
  selectedReservation: any; // Variable para almacenar la reserva seleccionada

  constructor(private api: DataService, private http: HttpClient) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');

    this.api.getOptionsReservation().subscribe((data: any[]) => {
      // Mapea los datos recibidos de la API y selecciona solo los campos que quieres mostrar
      this.reservations = data.map((reservation: any) => ({
        id: reservation.id_reservation,
        reservationDate: datePipe.transform(reservation.reservation_date, 'dd/MM/yyyy HH:mm'),
        entryDate: datePipe.transform(reservation.check_in, 'dd/MM/yyyy HH:mm'),
        departureDate: datePipe.transform(reservation.check_out, 'dd/MM/yyyy HH:mm'),
        vehicle: reservation.vehicles?.name,
        state: reservation.state,
        parkingName: reservation.parkings?.name,
        vehicleCode: reservation.vehicle_code,
        time: reservation.invoices?.time,
        valorReservation: reservation.invoices?.reserve_amount,
        valorService: reservation.invoices?.service_amount,
        refundAmount: reservation.invoices?.refund_amount,
        timeExtra: reservation.invoices?.extra_time_amount,
        totalAmount: reservation.invoices?.total_amount,
        idReservation: reservation.invoices?.id_invoice
      }));
      // Inicialmente, mostrar todas las reservas
      this.filteredReservations = this.reservations;
    });
  }

  applyFilter(): void {
    if (this.selectedState === 'Todos') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(reservation => reservation.state === this.selectedState);
    }
  }

  sendInvoiceEmail(invoiceId: number): void {
    const url = `${this.apiUrl}/${invoiceId}`;
    this.http.get(url, { responseType: 'text' }).subscribe(
      response => {
        console.log('Correo enviado correctamente:', response);
      },
      error => {
        console.error('Error enviando el correo:', error);
      }
    );
  }

  showDetails(event: MouseEvent | undefined, reservation: any) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedReservation = reservation;
  }

  closeDetailsModal() {
    this.selectedReservation = null;
  }
}
