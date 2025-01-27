import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrderComponent } from './components/order/order.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin-dashboard',
    component: DashboardComponent
  },
  {
<<<<<<< HEAD
    path:'about',
    component:AboutComponent
=======
    path: 'about',
    component: AboutComponent
>>>>>>> 47524664fbf4bbb21cab28c81000e0eae5d24931
  }
];
