import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GasDTO } from '../model/gas.model';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  currentCartItems = this.cartItems.asObservable();

  constructor() {
    // Load cart items from localStorage on service initialization
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  // Add methods to manage cart items
  removeFromCart(itemId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
    if (updatedItems.length === 0) {
      localStorage.removeItem('cartItems'); // Clear localStorage if cart is empty
    } else {
      this.saveToLocalStorage();
    }
  }

  updateQuantity(itemId: number, change: number) {
    const currentItems = this.cartItems.value;
    const itemToUpdate = currentItems.find(item => item.id === itemId);
    
    if (itemToUpdate) {
      itemToUpdate.quantity += change;
      if (itemToUpdate.quantity < 1) {
        this.removeFromCart(itemId);
      } else {
        this.cartItems.next([...currentItems]);
        this.saveToLocalStorage();
      }
    }
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cartItems');
  }

  addToCart(product: GasDTO) {
    if (!product.id) {
      throw new Error('Product ID is undefined');
    }

    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, 1);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: `${product.capacity}kg Gas Cylinder`,
        price: product.price,
        quantity: 1,
        imageUrl: 'assets/CADAC Sylinder.webp' // You can adjust this default image
      };
      this.cartItems.next([...currentItems, newItem]);
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems.value));
  }
}
