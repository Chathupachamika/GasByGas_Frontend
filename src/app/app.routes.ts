import { Routes } from '@angular/router';
import { LoginComponent } from './admin/components/login/login.component';
import { OrderComponent } from './admin/components/order/order.component';
import { RegisterComponent } from './admin/components/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductsComponent } from './admin/components/products/products.component';
import { AboutComponent } from './admin/components/about/about.component';

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
    path:'product',
    component: ProductsComponent
  },

{
  path: 'about',
  component: AboutComponent
}
];
