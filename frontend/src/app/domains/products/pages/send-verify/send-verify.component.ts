import {Component, inject} from '@angular/core';
import {ForgotPasswordService} from "@shared/forgotPassword/forgot-password.service";
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import Swal from 'sweetalert2';
import {SendVerifyService} from "@shared/sendVerify/send-verify.service";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './send-verify.component.html',
  styleUrl: './send-verify.component.html'
})
export class SendVerifyComponent {

  formulario: FormGroup;

  sendVerifyService = inject(SendVerifyService);

  constructor(private router: Router) {
    this.formulario = new FormGroup({
      mail: new FormControl,
    });
  }

  async onSubmit() {
    try {
      const formValueWithAdditionalParams = {
        ...this.formulario.value,
        type: 'Welcome',
        url: window.location.origin + '/verify-email?token='
      };
      await this.sendVerifyService.postSendVerify(formValueWithAdditionalParams);
      await Swal.fire({
        title: '¡Correo enviado!',
        text: 'Revisa tu bandeja de entrada y haz clic en el enlace de verificación.',
        icon: 'success',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#2563eb'
      });
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
