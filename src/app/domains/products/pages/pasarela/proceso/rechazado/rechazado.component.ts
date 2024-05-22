import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pago-procesando',
  templateUrl: 'rechazado.component.html',
  styleUrls: ['rechazado.component.css']
})
export class RechazadoComponent implements OnInit {
  mensaje = 'Pago procesando';
  animacionClase = 'fade-in';

  ngOnInit() {
    setTimeout(() => {
      this.animacionClase = 'fade-out';
      setTimeout(() => {
        this.mensaje = 'Pago rechazado';
        this.animacionClase = 'fade-in';
      }, 500);
    }, 5000);
  }
}