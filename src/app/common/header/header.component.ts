import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any = null;
  showProfilePopup = false;
  editedUserDetails: any = {};
  isEditMode = false;
  showCartPopup = false;
  cartItems: CartItem[] = [
    // Adding some sample items for testing
    {
      id: 1,
      name: 'Regular Gas Cylinder',
      price: 49.99,
      quantity: 1,
      imageUrl: 'assets/CADAC Sylinder.webp'
    },
    {
      id: 2,
      name: 'Premium Gas Cylinder',
      price: 129.99,
      quantity: 1,
      imageUrl: 'assets/2ndGass.webp'
    }
  ];

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
      this.editedUserDetails = { ...this.userDetails };
      console.log('Loaded user details:', this.userDetails);
    }
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
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
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert('Failed to update profile. Please try again.');
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
    item.quantity++;
    this.updateLocalStorage();
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateLocalStorage();
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.updateLocalStorage();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
    this.toggleCartPopup();
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
    this.toggleCartPopup();
  }
}
