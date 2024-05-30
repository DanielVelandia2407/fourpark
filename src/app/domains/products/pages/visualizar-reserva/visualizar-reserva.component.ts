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
import Swal from 'sweetalert2';

// Definición del componente y metadatos asociados
@Component({
  selector: 'app-visualizar-reserva',
  standalone: true,
  imports: [HeaderComponent, CommonModule, DatePipe, FormsModule],
  templateUrl: './visualizar-reserva.component.html',
  styleUrls: ['./visualizar-reserva.component.css']
})
export class VisualizarReservaComponent implements OnInit {

  // URL de la API para enviar correos de facturas
  private apiUrl = 'https://fourparkscolombia.onrender.com/api/invoice-mail';
  
  // Listas para almacenar reservas
  reservations: any[] = [];
  filteredReservations: any[] = [];
  
  // Estado de filtro seleccionado
  selectedState: string = 'Todos';
  selectedReservation: any;
  reservaSeleccionada: any;

  // Variables para almacenar información del token
  idUsuario: number;
  rol: string;
  iat: number;
  exp: number;

  // Estado de las modales de confirmación
  showCancelConfirmationModal: boolean = false;
  showCheckInConfirmationModal: boolean = false;
  showCheckOutConfirmationModal: boolean = false;

  // Inyección de dependencias necesarias
  constructor(
    private api: DataService, 
    private http: HttpClient, 
    private jwtService: TokenService, 
    private reservaService: ReservaService,
    private checkinService: CheckinService,
    private checkoutService: CheckoutService
  ) {}

  // Método de inicialización del componente
  ngOnInit(): void {
    // Creación de instancia de DatePipe para formatear fechas
    const datePipe = new DatePipe('en-US');
    
    // Recuperación del token del localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Decodificación del token si existe
      const decodedToken = this.jwtService.getDecodedToken(token);
      this.idUsuario = decodedToken.id_user;
      this.rol = decodedToken.role;
      this.iat = decodedToken.iat;
      this.exp = decodedToken.exp;
    } else {
      console.log('No token found in local storage');
    }

    // Obtención de las reservas a través del servicio de datos
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

  // Método para aplicar el filtro de estado a las reservas
  applyFilter(): void {
    if (this.selectedState === 'Todos') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(reservation => reservation.state === this.selectedState);
    }
  }

  // Método para enviar la factura por correo electrónico
  sendInvoiceEmail(invoiceId: number): void {
    const url = `${this.apiUrl}/${invoiceId}`;
    this.http.get(url, { responseType: 'text' }).subscribe(
      response => {
        console.log('Correo enviado correctamente:', response);
        Swal.fire('¡La factura ha sido enviada exitosamente!');
      },
      error => {
        console.error('Error enviando el correo:', error);
        Swal.fire('Hubo un error al enviar la factura. Por favor, inténtalo de nuevo más tarde.');
      }
    );
  }

  // Método para mostrar los detalles de una reserva
  showDetails(event: MouseEvent | undefined, reservation: any) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedReservation = reservation;
  }

  // Método para cerrar el modal de detalles
  closeDetailsModal() {
    this.selectedReservation = null;
  }

  // Métodos para manejar la confirmación de cancelación de reserva
  abrirModalCancelacion(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCancelConfirmationModal = true;
  }

  closeCancelConfirmationModal(): void {
    this.showCancelConfirmationModal = false;
  }

  confirmarCancelacion(reservationId: number) {
    this.reservaService.cancelReservation(reservationId)
      .subscribe(
        response => {
          Swal.fire({
            title: 'Reserva cancelada correctamente',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCancelConfirmationModal = false;
              window.location.reload();
            }
          });
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error durante la cancelacion',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCancelConfirmationModal = false;
            }
          });
        }
      );
  }

  // Métodos para manejar la confirmación de check-in
  abrirModalCheckIn(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCheckInConfirmationModal = true;
  }

  closeCheckInConfirmationModal(): void {
    this.showCheckInConfirmationModal = false;
  }

  confirmarCheckIn(reservationId: number) {
    this.checkinService.checkinReservation(reservationId)
      .subscribe(
        response => {
          Swal.fire({
            title: 'Check in exitoso',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCheckInConfirmationModal = false;
              window.location.reload();
            }
          });
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error durante el check in.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCheckInConfirmationModal = false;
            }
          });
        }
      );
  }

  // Métodos para manejar la confirmación de check-out
  abrirModalCheckOut(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.showCheckOutConfirmationModal = true;
  }

  closeCheckOutConfirmationModal(): void {
    this.showCheckOutConfirmationModal = false;
  }

  confirmarCheckOut(reservationId: number) {
    this.checkoutService.checkOutReservation(reservationId)
      .subscribe(
        response => {
          Swal.fire({
            title: 'Check out exitoso',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCheckOutConfirmationModal = false;
              window.location.reload();
            }
          });
        },
        error => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error durante el check out.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showCheckOutConfirmationModal = false;
            }
          });
        }
      );
  }
}
