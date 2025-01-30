import { Routes } from '@angular/router';
<<<<<<< HEAD
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';
import { OrderComponent } from './user/components/order/order.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ProductsComponent } from './user/components/products/products.component';
import { AboutComponent } from './user/components/about/about.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminDheaderComponent } from './admin/admin-dheader/admin-dheader.component';
import { AdminOrderComponent } from './admin/components/admin-order/admin-order.component';
import { AdminProductsComponent } from './admin/components/admin-products/admin-products.component';
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component';
import { ModeratorHeaderComponent } from './moderator/moderator-header/moderator-header.component';
import { ModeratorOrderComponent } from './moderator/components/moderator-order/moderator-order.component';
import { ModeratorOproductsComponent } from './moderator/components/moderator-oproducts/moderator-oproducts.component';
import { AuthGuard } from './authGuard/auth.guard';
=======
import { LoginComponent } from './admin/components/login/login.component';
import { OrderComponent } from './admin/components/order/order.component';
import { RegisterComponent } from './admin/components/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductsComponent } from './admin/components/products/products.component';
import { ContactComponent } from './admin/components/contact/contact.component';
import { AboutComponent } from './admin/components/about/about.component';
>>>>>>> 341ee4e50e8a00a330b2cd3314089ea695e6cef0

export const routes: Routes = [
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
<<<<<<< HEAD
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
=======
    path: 'product',
    component: ProductsComponent
  },

  {
    path:'about',
    component: AboutComponent
  },
  {
    path:'contact',
    component:ContactComponent
>>>>>>> 341ee4e50e8a00a330b2cd3314089ea695e6cef0
  }
];
