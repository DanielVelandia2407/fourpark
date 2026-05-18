import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyEmailService } from '@shared/verifyEmail/verify-email.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  verifyEmailService = inject(VerifyEmailService);
  token: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

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

  async verifyEmail() {
    if (!this.token) {
      Swal.fire({
        title: "¡Error!",
        text: "No se ha encontrado el token",
        icon: "error"
      });
      return;
    }

    try {
      const endpoint = `https://fourparkscolombia.onrender.com/api/verify-mail/${this.token}`;
      const response = await this.verifyEmailService.postVerifyEmail(endpoint);
      console.log(response);
      Swal.fire({
        title: "¡Éxito!",
        text: "Correo verificado con éxito",
        icon: "success"
      });
      this.router.navigateByUrl('/login');
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "No se ha podido verificar el correo",
        icon: "warning"
      });
    }
  }
}

