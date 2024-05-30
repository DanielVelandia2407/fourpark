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
import { VnologueoComponent } from '@shared/components/vnologueo/vnologueo.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { Auth2Guard } from './guards/auth2/auth2.guard';


// Admin
//Super Admin
import { ReservesComponent } from './reserves/reserves.component';
import { AdministratorsOfParkingsComponent } from './domains/admin/administrators-of-parkings/administrators-of-parkings.component';
import { StatsSuperAdminComponent } from './domains/admin/stats-super-admin/stats-super-admin.component';

//Admin parking 
import { StatsComponent } from './admin_parking/stats/stats.component';
import { VisualizarReservaComponent } from '@products/pages/visualizar-reserva/visualizar-reserva.component';
import { PasarelaComponent } from '@products/pages/pasarela/pasarela.component';
import {CompletadoComponent} from '@products/pages/pasarela/proceso/completado/completado.component'
import { RechazadoComponent } from '@products/pages/pasarela/proceso/rechazado/rechazado.component';
import { ActualizarTarjetaComponent } from '@products/pages/pasarela/actualizarTarjeta/actualizar-tarjeta/actualizar-tarjeta.component';

// Admin
import { AdminPageComponent } from './domains/admin/admin-parking/admin-page.component';
import { AdminUsersComponent } from './domains/admin/admin-users/admin-users.component';
import { MainAdminPageComponent } from './domains/admin/main-admin-page/main-admin-page.component';
import { AdminParkingsComponent } from './domains/admin/admin-parkings/admin-parkings.component';
import { EditUserAdminComponent } from './domains/admin/admin-users/admin-users.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ListComponent, canActivate: [Auth2Guard]
      },
    ]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: MainAdminPageComponent, canActivate: [AuthGuard], data: { role: 'Gerente' },
    children: [
      {
        path: 'users',
        component: AdminUsersComponent,
        children : [
          {
            path : 'edit/:id',
            component : EditUserAdminComponent
          }
        ]
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
      },
      {
        path : 'admins',
        component :  AdministratorsOfParkingsComponent,
        children : [
          {
            path : 'edit/:id',
            component : EditUserAdminComponent
          }
        ]
      },
      {
        path :  'stats',
        component : StatsSuperAdminComponent  
      }

    ]
  },
  {
    path: 'reserves/:id',
    component: ReservesComponent, canActivate: [Auth2Guard]
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
    component: PasarelaComponent, canActivate: [AuthGuard], data: { role: 'Cliente' }
  },
  {
    path: 'procesoc',
    component: CompletadoComponent, canActivate: [AuthGuard], data: { role: 'Cliente' }
  },
  {
    path: 'procesor',
    component: RechazadoComponent, canActivate: [AuthGuard], data: { role: 'Cliente' }
  },
  {
    path : 'adminParkings',
    component :  StatsComponent, canActivate: [AuthGuard], data: { role: 'Administrador' }},
  {
    path:'actualizartc',
    component: ActualizarTarjetaComponent, canActivate: [AuthGuard], data: { role: 'Cliente' }
  },
  {
    path: 'vreservas',
    component: VisualizarReservaComponent, canActivate: [Auth2Guard]
  },
  {
    path: 'inicio-nologueado',
    component: VnologueoComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }

  

];
