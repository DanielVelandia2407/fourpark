import { Component, inject } from '@angular/core';
import { LoginService } from "@shared/login/login.service";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import Swal from 'sweetalert2';
import { TokenService } from '@shared/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formulario: FormGroup;
  loading = false;

  loginService = inject(LoginService);

  constructor(private router: Router, private tokenService: TokenService) {
    this.formulario = new FormGroup({
      user_name: new FormControl(),
      password: new FormControl(),
    });
  }

  async onSubmit() {
    this.loading = true;
    try {
      const response = await this.loginService.postLogin(this.formulario.value);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        const role = this.tokenService.getUserRole();
        if (role === 'SuperAdministrador') {
          this.router.navigateByUrl('/admin');
        } else if (role === 'Administrador') {
          this.router.navigateByUrl('/adminParkings');
        } else {
          this.router.navigateByUrl('/');
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        icon: "warning"
      });
    } finally {
      this.loading = false;
    }
  }
}
