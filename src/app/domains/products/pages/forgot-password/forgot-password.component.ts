import {Component, inject} from '@angular/core';
import {ForgotPasswordService} from "@shared/forgotPassword/forgot-password.service";
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  formulario: FormGroup;

  forgotPasswordService = inject(ForgotPasswordService);

  constructor(private router: Router) {
    this.formulario = new FormGroup({
      mail: new FormControl,
    });
  }

  async onSubmit() {
    try {
      const formValueWithAdditionalParams = {
        ...this.formulario.value,
        type: 'Recovery',
        url: 'http://fourpark.vercel.app/restore-password?token='
      };
      const response = await this.forgotPasswordService.postForgotPassword(formValueWithAdditionalParams);
      console.log(response);
      this.router.navigateByUrl('/login');
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "Correo no encontrado",
        icon: "warning"
      });
    }
  }

}
