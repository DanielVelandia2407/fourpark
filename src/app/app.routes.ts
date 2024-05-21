import {Routes} from '@angular/router';

import {ListComponent} from "./domains/products/pages/list/list.component";
import {LayoutComponent} from "@shared/components/layout/layout.component";
import {AboutComponent} from "./domains/info/pages/about/about.component";
import {NotFoundComponent} from "./domains/info/pages/not-found/not-found.component";
import {LoginComponent} from "@products/pages/login/login.component";
import {RegisterComponent} from "@products/pages/register/register.component";
import {TycComponent} from "./domains/info/pages/tyc/tyc.component";



// Admin
import { AdminPageComponent } from './domains/admin/admin-parking/admin-page.component';
import { AdminUsersComponent } from './domains/admin/admin-users/admin-users.component';
import { MainAdminPageComponent } from './domains/admin/main-admin-page/main-admin-page.component';
import { AdminParkingsComponent } from './domains/admin/admin-parkings/admin-parkings.component';

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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: MainAdminPageComponent,
    children: [
      {
        path: 'users',
        component: AdminUsersComponent
      },
      {
        path: 'parkings',
        component : AdminParkingsComponent,
        children : [
          {
            path : 'create',
            component : AdminPageComponent
          }
        ]
      }

    ]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tyc',
    component: TycComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },

];
