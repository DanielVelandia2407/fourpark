import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResetPasswordService} from '@shared/resetPassword/reset-password.service';
import Swal from 'sweetalert2';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.css'
})
export class RestorePasswordComponent implements OnInit {

  formulario: FormGroup;
  resetPasswordService = inject(ResetPasswordService);
  token: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.formulario = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        Swal.fire({
          title: "¡Error!",
          text: "Token no encontrado en la URL",
          icon: "error"
        });
        this.router.navigateByUrl('/login');
      }
    });
  }

  async onSubmit() {
    if (this.formulario.invalid) {
      Swal.fire({
        title: "¡Error!",
        text: "El formulario no es válido",
        icon: "error"
      });
      return;
    }

    if (this.formulario.value.password !== this.formulario.value.confirmPassword) {
      Swal.fire({
        title: "¡Error!",
        text: "Las contraseñas no coinciden",
        icon: "error"
      });
      return;
    }

    try {
      const formValue = {password: this.formulario.value.password};
      const endpoint = `https://fourparkscolombia.onrender.com/api/recover-password${this.token}`;
      const response = await this.resetPasswordService.postRecoverPassword(endpoint, formValue);
      console.log(response);
      this.router.navigateByUrl('/login');
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "No se ha podido restablecer la contraseña",
        icon: "warning"
      });
    }
  }
}
