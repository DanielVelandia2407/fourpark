import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-procesando',
  templateUrl: 'completado.component.html',
  styleUrls: ['completado.component.css']
})
export class CompletadoComponent implements OnInit {
  mensaje = 'Pago procesando';
  animacionClase = 'slide-in';
  completado = false;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.animacionClase = 'shake';
      setTimeout(() => {
        this.mensaje = 'Pago completado';
        this.completado = true;
        this.animacionClase = 'scale-in';
        // Navegar a la ruta de inicio después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/']); // Cambia '/' con la ruta de inicio correcta
        }, 2000);
      }, 1000);
    }, 5000);
  }
}
