import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { DataService } from '../../../../services/admin/data.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TokenService } from '@shared/token/token.service';
import { ReservaService } from '@shared/reserva/reserva.service';
import { CheckinService } from '@shared/reserva/checkin/checkin.service';
import { CheckoutService } from '@shared/reserva/checkout/checkout.service';

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
  selectedState: string = 'Todos'; 
  selectedReservation: any;
  reservaSeleccionada: any;

  // variables del token 
  idUsuario: number;
  rol: string;
  iat: number;
  exp: number;

  // Cancelar reserva - check in - check-out
  showCancelConfirmationModal: boolean = false;
  showCheckInConfirmationModal: boolean = false;
  showCheckOutConfirmationModal: boolean = false;


  constructor(private api: DataService, 
    private http: HttpClient, 
    private jwtService: TokenService, 
    private reservaService: ReservaService,
    private checkinService: CheckinService,
    private checkoutService: CheckoutService) {}

  ngOnInit(): void {

    const datePipe = new DatePipe('en-US');
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = this.jwtService.getDecodedToken(token);
      this.idUsuario = decodedToken.id_user;
      this.rol = decodedToken.role;
      this.iat = decodedToken.iat;
      this.exp = decodedToken.exp;
    } else {
      console.log('No token found in local storage');
    }

    this.api.getOptionsReservation().subscribe((data: any[]) => {
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
        idReservation: reservation.invoices?.id_invoice,
        image_path: reservation.parkings?.image_path,
        user_name: reservation.users?.user_name
      }));
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
        alert('¡La factura ha sido enviada exitosamente!');
      },
      error => {
        console.error('Error enviando el correo:', error);
        alert('Hubo un error al enviar la factura. Por favor, inténtalo de nuevo más tarde.');
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

  // Método para mostrar la pantalla emergente de confirmación de cancelación
  abrirModalCancelacion(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCancelConfirmationModal = true;
  }

  // Método para cerrar la pantalla emergente de confirmación de cancelación
  closeCancelConfirmationModal(): void {
    this.showCancelConfirmationModal = false;
  }

  // Método para cancelar la reserva (se ejecutará cuando se haga clic en el botón "Sí" en la pantalla emergente)
  confirmarCancelacion(reservationId: number) {
    this.reservaService.cancelReservation(reservationId)
      .subscribe(
        response => {
          alert('Reserva cancelada correctamente:');
          this.showCancelConfirmationModal = false;
          window.location.reload();
        },
        error => {
          alert('Error al cancelar la reserva:');
        }
      );
  }

  // Método para mostrar la pantalla emergente de confirmación de check in
  abrirModalCheckIn(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCheckInConfirmationModal = true;
  }

  // Método para cerrar la pantalla emergente de confirmación de check in
  closeCheckInConfirmationModal(): void {
    this.showCheckInConfirmationModal = false;
  }

  // Método para check in a la reserva (se ejecutará cuando se haga clic en el botón "Sí" en la pantalla emergente)
  confirmarCheckIn(reservationId: number) {
    this.checkinService.checkinReservation(reservationId)
      .subscribe(
        response => {
          alert('Check in exitoso:');
          this.showCheckInConfirmationModal = false;
          window.location.reload();
        },
        error => {
          alert('Error al realizar check in a la reserva:');
          this.showCheckInConfirmationModal = false;
        }
      );
  }

  // Método para mostrar la pantalla emergente de confirmación de check in
  abrirModalCheckOut(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCheckOutConfirmationModal = true;
  }

  // Método para cerrar la pantalla emergente de confirmación de check in
  closeCheckOutConfirmationModal(): void {
    this.showCheckOutConfirmationModal = false;
  }

  // Método para check out a la reserva (se ejecutará cuando se haga clic en el botón "Sí" en la pantalla emergente)
  confirmarCheckOut(reservationId: number) {
    this.checkoutService.checkOutReservation(reservationId)
      .subscribe(
        response => {
          alert('Check out exitoso:');
          this.showCheckOutConfirmationModal = false;
          window.location.reload();
        },
        error => {
          alert('Error al realizar check out a la reserva:');
          this.showCheckOutConfirmationModal = false;
        }
      );
  }
}