import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pago-procesando',
  templateUrl: 'completado.component.html',
  styleUrls: ['completado.component.css']
})
export class CompletadoComponent implements OnInit {
  mensaje = 'Pago procesando';
  animacionClase = 'slide-in';
  completado = false;

  ngOnInit() {
    setTimeout(() => {
      this.animacionClase = 'shake';
      setTimeout(() => {
        this.mensaje = 'Pago completado';
        this.completado = true;
        this.animacionClase = 'scale-in';
      }, 1000);
    }, 5000);
  }
}