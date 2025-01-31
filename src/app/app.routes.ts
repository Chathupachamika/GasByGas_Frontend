import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminDheaderComponent } from './admin/admin-dheader/admin-dheader.component';
import { AdminOrderComponent } from './admin/components/admin-order/admin-order.component';
import { AdminProductsComponent } from './admin/components/admin-products/admin-products.component';
import { AuthGuard } from './authGuard/auth.guard';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';
import { ModeratorOproductsComponent } from './moderator/components/moderator-oproducts/moderator-oproducts.component';
import { ModeratorOrderComponent } from './moderator/components/moderator-order/moderator-order.component';
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component';
import { ModeratorHeaderComponent } from './moderator/moderator-header/moderator-header.component';
import { AboutComponent } from './common/about/about.component';
import { ContactComponent } from './user/components/contact/contact.component';
import { OrderComponent } from './user/components/order/order.component';
import { ProductsComponent } from './user/components/products/products.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ServiceComponent } from './common/service/service.component';

export const routes: Routes = [
  {
    path: 'service',
    component: ServiceComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // Admin routes
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin-header',
    component: AdminDheaderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin-order',
    component: AdminOrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin-products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  // Moderator routes
  {
    path: 'moderator-dashboard',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MODERATOR'] }
  },
  {
    path: 'moderator-header',
    component: ModeratorHeaderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MODERATOR'] }
  },
  {
    path: 'moderator-order',
    component: ModeratorOrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MODERATOR'] }
  },
  {
    path: 'moderator-products',
    component: ModeratorOproductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MODERATOR'] }
  },
  // User routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'product',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER', 'ADMIN', 'MODERATOR'] }
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];
