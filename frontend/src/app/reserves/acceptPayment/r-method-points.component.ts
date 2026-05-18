import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-r-method-points',
  templateUrl: './r-method-points.component.html',
  styleUrls: ['./r-method-points.component.css']
})
export class RMethodPointsComponent implements OnInit {

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
