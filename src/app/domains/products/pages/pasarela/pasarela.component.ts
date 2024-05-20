import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators, ReactiveFormsModule  } from '@angular/forms';

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pasarela.component.html',
  styleUrl: './pasarela.component.css'
})
export class PasarelaComponent {

  pasarelaForm = new FormGroup({
    nombreTitular: new FormControl('', Validators.required),
    numeroTarjeta : new FormControl('', Validators.required),
    fechaMes : new FormControl('', Validators.required),
    fechaAnio : new FormControl('', Validators.required),
    cvc : new FormControl('', Validators.required)
  })

  constructor() { }

  ngOnInit(): void {

  }

  onPasarela(form:any): void{
    console.log(form)
  }

}
