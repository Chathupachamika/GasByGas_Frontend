import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationDTO } from '../../model/notification.model';
import { CartService } from '../../service/cart.service';
import { NotificationService } from '../../service/notification.service';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-admin-dheader',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dheader.component.html',
  styleUrls: ['./admin-dheader.component.css']
})
export class AdminDheaderComponent implements OnInit {
  userDetails: any = null;
  showProfilePopup = false;
  editedUserDetails: any = {};
  isEditMode = false;
  showCartPopup = false;
  cartItems: CartItem[] = []; // Initialize as empty array
  showNotificationsPopup = false;
  notifications: NotificationDTO[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      this.editedUserDetails = { ...this.userDetails };
      console.log('Loaded user details:', this.userDetails);
    }
    // Subscribe to cart updates from CartService
    this.cartService.currentCartItems.subscribe(items => {
      this.cartItems = items;
    });
    // Subscribe to notifications
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  toggleProfilePopup(): void {
    this.showProfilePopup = !this.showProfilePopup;
    this.isEditMode = false; // Always start in view mode
    if (this.showProfilePopup) {
      this.editedUserDetails = { ...this.userDetails };
    }
  }

  closePopup(): void {
    this.showProfilePopup = false;
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getUserRole(): string {
    if (this.userDetails?.roles?.length > 0) {
      return this.userDetails.roles[0].replace('ROLE_', '');
    }
    return '';
  }

  updateProfile(): void {
    this.loginService.updateUser(this.editedUserDetails).subscribe({
      next: (response) => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(response));
        this.closePopup();
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          timer: 2000,
          showConfirmButton: false,
          position: 'center', // Changed from 'top-end' to 'center'
          background: '#fff',
          customClass: {
            popup: 'animated fadeInDown'
          }
        });
      },
      error: (error) => {
        console.error('Update failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update your profile. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0F3B7A',
          position: 'center' // Added position center for error alert as well
        });
      }
    });
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editedUserDetails = { ...this.userDetails };
  }

  confirmDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Add delete account logic here
      console.log('Delete account');
    }
  }

  toggleCartPopup(): void {
    console.log('Toggling cart popup');  // Debug log
    this.showCartPopup = !this.showCartPopup;
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, 1);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, -1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout(): void {
    this.router.navigate(['/order'], { queryParams: { step: '4' } });
    this.toggleCartPopup();
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
    this.toggleCartPopup();
  }

  toggleNotificationsPopup(): void {
    console.log('Toggling notifications popup'); // Add this debug log
    this.showNotificationsPopup = !this.showNotificationsPopup;

    // Close other popups when notifications popup is opened
    if (this.showNotificationsPopup) {
      this.showProfilePopup = false;
      this.showCartPopup = false;
    }
  }

  markAsRead(notification: NotificationDTO): void {
    if (notification.id) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  clearAllNotifications(): void {
    this.notificationService.clearAll();
  }

  deleteNotification(event: Event, notification: NotificationDTO): void {
    event.stopPropagation(); // Prevent triggering markAsRead
    if (notification.id) {
      this.notificationService.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notificationService.removeNotificationFromList(notification.id!);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Notification has been deleted.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete notification.',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }
}
