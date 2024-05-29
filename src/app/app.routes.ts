import {Routes} from '@angular/router';
import {ListComponent} from "./domains/products/pages/list/list.component";
import {LayoutComponent} from "@shared/components/layout/layout.component";
import {AboutComponent} from "./domains/info/pages/about/about.component";
import {NotFoundComponent} from "./domains/info/pages/not-found/not-found.component";
import {LoginComponent} from "@products/pages/login/login.component";
import {RegisterComponent} from "@products/pages/register/register.component";
import {TycComponent} from "./domains/info/pages/tyc/tyc.component";
import {ForgotPasswordComponent} from "@products/pages/forgot-password/forgot-password.component";
import {RestorePasswordComponent} from "@products/pages/restore-password/restore-password.component";


// Admin
import {AdminPageComponent} from './domains/admin/admin-parking/admin-page.component';
import {AdminUsersComponent} from './domains/admin/admin-users/admin-users.component';
import {MainAdminPageComponent} from './domains/admin/main-admin-page/main-admin-page.component';
import {AdminParkingsComponent} from './domains/admin/admin-parkings/admin-parkings.component';
import {PasarelaComponent} from '@products/pages/pasarela/pasarela.component';
import {CompletadoComponent} from '@products/pages/pasarela/proceso/completado/completado.component';
import {RechazadoComponent} from '@products/pages/pasarela/proceso/rechazado/rechazado.component';
import { ReservesComponent } from './reserves/reserves.component';

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
        component: AdminParkingsComponent,
        children: [
          {
            path: 'create',
            component: AdminPageComponent
          }
        ]
      }

    ]
  },
  {
    path: 'reserves/:id',
    component: ReservesComponent
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
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'restore-password',
    component: RestorePasswordComponent
  },
  {
    path: 'pasarela',
    component: PasarelaComponent
  },
  {
    path: 'procesoc',
    component: CompletadoComponent
  },
  {
    path: 'procesor',
    component: RechazadoComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },

];
