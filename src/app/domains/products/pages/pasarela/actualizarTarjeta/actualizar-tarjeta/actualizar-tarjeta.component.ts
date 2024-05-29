import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { RouterLinkWithHref, RouterLinkActive, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '@shared/card/card.service';

@Component({
  selector: 'app-actualizar-tarjeta',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLinkWithHref, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './actualizar-tarjeta.component.html',
  styleUrls: ['./actualizar-tarjeta.component.css']
})
export class ActualizarTarjetaComponent implements OnInit {
  cardForm: FormGroup;
  showModal = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cardService: CardService  // Inyecta el servicio aquí
  ) { }

  ngOnInit() {
    this.initForm();
    this.showModal = true;
  }

  initForm() {
    this.cardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])/\\d{2}')]],
      securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  updateCard() {
    if (this.cardForm.valid) {
      const cardData = {
        number: this.cardForm.value.cardNumber,
        expiration_date: this.cardForm.value.expiryDate,
        cvc: this.cardForm.value.securityCode
      };

      this.cardService.updateCard(cardData).subscribe(
        response => {
          console.log('Tarjeta actualizada:', response);
          this.closeModal();
        },
        error => {
          alert('Error al actualizar la tarjeta. Tarjeta no valida, intenta nuevamente');
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
    this.router.navigateByUrl('/');
  }
}
