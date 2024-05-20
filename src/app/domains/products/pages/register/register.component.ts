import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RegisterService } from "./../../../shared/register/register.service";
import { inject } from "@angular/core";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formulario: FormGroup;

  registerService = inject(RegisterService);

  constructor() {
    this.formulario = new FormGroup({
      mail: new FormControl(),
      user_name: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      password: new FormControl(),
      identification_card: new FormControl(),
      number: new FormControl(),
      expiration_date: new FormControl(),
      cvc: new FormControl()
    });
  }

  async onSubmit() {
    const response = await this.registerService.postRegister(this.formulario.value);
    console.log(response);
  }

}
