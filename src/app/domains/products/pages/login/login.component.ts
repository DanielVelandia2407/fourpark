import {Component, inject} from '@angular/core';
import {LoginService} from "@shared/login/login.service";
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario: FormGroup;

  loginService = inject(LoginService);

  constructor(private router: Router) {
    this.formulario = new FormGroup({
      user_name: new FormControl,
      password: new FormControl,
    });
  }

  async onSubmit() {
    try {
      const response = await this.loginService.postLogin(this.formulario.value);
      console.log(response);
      if (response && response.token) {
        localStorage.setItem('token', response.token)
      }
      this.router.navigateByUrl('');
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "La combinación de usuario y contraseña no es correcta",
        icon: "warning"
      });
    }
  }
}
