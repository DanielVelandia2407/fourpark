import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RegisterService, RegisterResponse } from "./../../../shared/register/register.service";
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formulario: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  registerService = inject(RegisterService);

  constructor(private router: Router) {
    this.formulario = new FormGroup({
      mail: new FormControl(),
      user_name: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      password: new FormControl(),
      identification_card: new FormControl(),
      number: new FormControl(),
      expiration_date: new FormControl(),
      cvc: new FormControl()
    });
  }

  async onSubmit() {
    this.loading = true;
    this.errorMessage = null;
    try {
      await this.registerService.postRegister(this.formulario.value);
      await Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Tu cuenta fue creada. Ahora debes verificar tu correo electrónico para activarla.',
        icon: 'success',
        confirmButtonText: 'Verificar correo',
        confirmButtonColor: '#2563eb'
      });
      this.router.navigateByUrl('/send-verify');
    } catch (error) {
      this.errorMessage = (error as Error).message || 'Error al registrar. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }
}
