// dashboard.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { OrderSummaryDTO } from "../../model/order-summary.model";
import { LoginService } from "../../service/login.service";
import { OrderService } from "../../service/order.service";
import { HeaderComponent } from "../header/header.component";
import { SidebarUserComponent } from "../sidebar-user/sidebar-user.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, SidebarUserComponent, HeaderComponent],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
      console.log('User ID:', this.userDetails.id);

      // Load orders for the specific user
      this.loadUserOrders();
    }
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

  loadUserOrders(): void {
    if (this.userDetails && this.userDetails.id) {
      console.log('Fetching orders for user ID:', this.userDetails.id);
      this.orderService.getOrdersByUserId(this.userDetails.id).subscribe(
        (orders) => {
          this.orders = orders;
          console.log('Loaded user orders:', orders);
        },
        (error) => {
          console.error('Error loading user orders:', error);
          if (error.status === 0) {
            console.error('CORS error or network issue');
          }
        }
      );
    } else {
      console.log('No user ID found, cannot fetch orders');
    }
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrderSummary(id).subscribe(
      () => {
        // Remove the deleted order from the list
        this.orders = this.orders.filter(order => order.id !== id);
        console.log(`Order with ID ${id} deleted successfully.`);
        // Reload the orders after deletion
        this.loadUserOrders();
      },
      (error) => console.error(`Error deleting order with ID ${id}`, error)
    );
  }
}
