import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-procesando',
  templateUrl: 'rechazado.component.html',
  styleUrls: ['rechazado.component.css']
})
export class RechazadoComponent implements OnInit {
  mensaje = 'Pago procesando';
  animacionClase = 'fade-in';

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.animacionClase = 'fade-out';
      setTimeout(() => {
        this.mensaje = 'Pago rechazado';
        this.animacionClase = 'fade-in';
        setTimeout(() => {
          this.router.navigate(['vreservas']); 
        }, 2000);
      }, 1000);
    }, 5000);
  } 
}