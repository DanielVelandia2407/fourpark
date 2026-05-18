import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cancel-reserve',
  standalone: true,
  imports: [],
  templateUrl: './cancel-reserve.component.html',
  styleUrl: './cancel-reserve.component.css'
})
export class CancelReserveComponent {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.redirectToHomePageAfterDelay(5000); // Redirige después de 5 segundos
  }

  redirectToHomePageAfterDelay(delay: number): void {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, delay);
  }
}
