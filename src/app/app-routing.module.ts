import { Routes } from '@angular/router';
// ...existing code...
import { AdminOrderComponent } from './admin/components/admin-order/admin-order.component';
import { AuthGuard } from './authGuard/auth.guard';
// ...existing code...

export const routes: Routes = [
  // ...existing code...
  {
    path: 'admin-order',
    component: AdminOrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  // ...existing code...
];
