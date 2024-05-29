import { Component, OnInit } from '@angular/core';
import { Card } from '../../../../services/admin/data.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from '../../../../services/admin/data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css'],
})
export class PasarelaComponent implements OnInit {
  pasarelaForm = new FormGroup({
    nombreTitular: new FormControl('', Validators.required),
    number: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{16}$'),
    ]), // Validación para número de tarjeta
    expiration_date: new FormControl('', [
      Validators.required,
      Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$'),
    ]), // Validación para fecha de expiración
    cvc: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{3,4}$'),
    ]), // Validación para CVC
  });

  card: Card | undefined;
  errorMessage: string | null = null;
  reservationData: any;

  constructor(private api: DataService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.reservationData = navigation?.extras.state?.['reservationData'];
  }

  ngOnInit(): void {
    this.api.getOptionsCards().subscribe((card: Card) => {
      this.card = card;
      console.log(this.card);
    });
  }

  onPasarela(): void {
    if (!this.pasarelaForm.valid) {
      this.errorMessage =
        'Formulario inválido. Por favor revisa los datos ingresados.';
      return;
    }

    const formValue = this.pasarelaForm.value;

    if (
      this.card &&
      formValue.cvc === this.card.cvc &&
      formValue.number === this.card.number &&
      formValue.expiration_date === this.card.expiration_date
    ) {
      console.log('ok');
      this.api.createReservation(this.reservationData).subscribe(
        (response: any) => {
          console.log('Reserva y pago exitosos', response);
          this.router.navigate(['/procesoc']);
        },
        (error) => {
          console.error('Error al realizar la reserva y pago', error);
          this.errorMessage = 'Error al realizar la reserva y pago';
        }
      );
    } else {
      this.errorMessage =
        'Datos incorrectos. Por favor verifica tu información.';
    }
  }
}
