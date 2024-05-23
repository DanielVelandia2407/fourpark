import { Component, OnInit } from '@angular/core';
import { Card } from '../../../../services/admin/data.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/admin/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Agrega CommonModule a los imports
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {

  pasarelaForm = new FormGroup({
    nombreTitular: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]), // Validación para número de tarjeta
    expiration_date: new FormControl('', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]), // Validación para fecha de expiración
    cvc: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]) // Validación para CVC
  });

  card: Card | undefined;
  errorMessage: string | null = null;

  constructor(private api: DataService, private router: Router) {}

  ngOnInit(): void {
    this.api.getOptionsCards().subscribe((card: Card) => {
      this.card = card;
      console.log(this.card);
    });
  }

  onPasarela(): void {
    if (!this.pasarelaForm.valid) {
      this.errorMessage = 'Formulario inválido. Por favor revisa los datos ingresados.';
      return;
    }

    const formValue = this.pasarelaForm.value;

    if (this.card &&
        formValue.cvc === this.card.cvc &&
        formValue.number === this.card.number &&
        formValue.expiration_date === this.card.expiration_date) {
      console.log("ok");
      this.router.navigate(['/procesoc']);
    } else {
      this.errorMessage = 'Datos incorrectos. Por favor verifica tu información.';
      
    }
  }
}

