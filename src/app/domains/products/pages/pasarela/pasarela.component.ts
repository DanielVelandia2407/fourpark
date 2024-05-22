import { Component } from '@angular/core';
import { Card } from '../../../../services/admin/data.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule  } from '@angular/forms';
import { DataService } from '../../../../services/admin/data.service'
//import { pasarelaI } from '@shared/models/pasarela.interface';

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
    number : new FormControl('', Validators.required),
    expiration_date : new FormControl('', Validators.required),
    cvc : new FormControl('', Validators.required)
  })

  constructor(private api:DataService) {}

  card:  Card  

  ngOnInit(form:any): void {
    this.api.getOptionsCards().subscribe((card: Card) => {
      this.card = card;
      console.log(this.card);

    });
  }

  
  
  onPasarela(form:any): void{

    if(form.cvc === this.card.cvc &&
      form.number === this.card.number &&
      form.expiration_date === this.card.expiration_date
    ){
      console.log("ok");
    }else{
      console.log("No")
    }

  }
    
  

}
