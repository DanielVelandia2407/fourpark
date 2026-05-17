import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RegisterService, RegisterResponse} from "./../../../shared/register/register.service";
import {inject} from "@angular/core";
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formulario: FormGroup;

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

  loading = false;
  errorMessage: string | null = null;
  isModalOpen = false;

  async onSubmit() {
    this.loading = true;
    this.errorMessage = null;
    try {
      const response = await this.registerService.postRegister(this.formulario.value);
      console.log(response);
      this.isModalOpen = true; // Abre el modal
    } catch (error) {
      this.errorMessage = (error as Error).message || 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }
}
