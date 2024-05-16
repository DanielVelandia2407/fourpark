import {Routes} from '@angular/router';

import {ListComponent} from "./domains/products/pages/list/list.component";
import {LayoutComponent} from "@shared/components/layout/layout.component";
import {AboutComponent} from "./domains/info/pages/about/about.component";
import {NotFoundComponent} from "./domains/info/pages/not-found/not-found.component";
import {LoginComponent} from "@products/pages/login/login.component";
import { PasarelaComponent } from '@products/pages/pasarela/pasarela.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ListComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
    ]
  },
    {
    path:'login',
    component: LoginComponent
  },
  {
    path:'pasarela',
    component: PasarelaComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
