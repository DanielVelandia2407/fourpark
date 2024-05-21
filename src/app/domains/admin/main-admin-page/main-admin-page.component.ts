import { Component , Renderer2} from '@angular/core';
import { RouterModule ,Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-main-admin-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-admin-page.component.html',
  styleUrl: './main-admin-page.component.css'
})
export class MainAdminPageComponent {


    selectedElement: any = null;
    constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2) { }


    clickRoute(target: any,  route: string){

      if (this.selectedElement) {
        this.renderer.removeClass(this.selectedElement, 'selected');
      }

      this.selectedElement = target.target;
      this.renderer.addClass(this.selectedElement, 'selected');


      // Navegar a la nueva ruta, añadiendo el segmento
      this.router.navigate([route], { relativeTo: this.route });
    }
}
