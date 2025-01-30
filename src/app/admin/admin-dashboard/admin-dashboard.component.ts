import { Component, OnInit } from '@angular/core';
import { AdminDheaderComponent } from "../admin-dheader/admin-dheader.component";
import { OrderSummaryDTO } from '../../model/order-summary.model';
import { LoginService } from '../../service/login.service';
import { OrderService } from '../../service/order.service';
import { CommonModule } from '@angular/common';

import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminDheaderComponent, CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  userDetails: any = null;
  orders: OrderSummaryDTO[] = [];

  constructor(
    private loginService: LoginService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get the stored user details from localStorage
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      console.log('Loaded user details:', this.userDetails);
    }

    // Load all order summaries
    this.loadAllOrderSummaries();
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getUserRole(): string {
    if (this.userDetails && this.userDetails.roles && this.userDetails.roles.length > 0) {
      return this.userDetails.roles[0].replace('ROLE_', '');
    }
    return '';
  }

  loadAllOrderSummaries(): void {
    this.orderService.getAllOrderSummary().subscribe(
      (orders) => {
        this.orders = orders;
        console.log('Loaded all order summaries:', orders);
      },
      (error) => console.error('Error loading order summaries', error)
    );
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrderSummary(id).subscribe(
      () => {
        // Remove the deleted order from the list
        this.orders = this.orders.filter(order => order.id !== id);
        console.log(`Order with ID ${id} deleted successfully.`);
      },
      (error) => console.error(`Error deleting order with ID ${id}`, error)
    );
  }
}
