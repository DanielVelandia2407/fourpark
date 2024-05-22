import { Component, OnInit } from '@angular/core';
import { Card } from '../../../../services/admin/data.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/admin/data.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css'] 
})
export class PasarelaComponent implements OnInit {

  pasarelaForm = new FormGroup({
    nombreTitular: new FormControl('', Validators.required),
    number: new FormControl('', Validators.required),
    expiration_date: new FormControl('', Validators.required),
    cvc: new FormControl('', Validators.required)
  });

  card: Card;

  constructor(private api: DataService, private router: Router) {} 

  ngOnInit(): void {
    this.api.getOptionsCards().subscribe((card: Card) => {
      this.card = card;
      console.log(this.card);
    });
  }

  onPasarela(form: any): void {
    if (form.cvc === this.card.cvc &&
        form.number === this.card.number &&
        form.expiration_date === this.card.expiration_date) {
      console.log("ok");
      this.router.navigate(['/procesoc']); 
    } else {
      console.log("No");
      this.router.navigate(['/procesor']); 
    }
  }
}
