import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../service/login.service';
import { PaypalService } from '../../service/paypal.service';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';


interface Gas {
  id: number;
  capacity: number;
  price: number;
  stock: number;
}

interface OrderGas {
  gasId: number;
  quantity: number;
  location?: string;  // Add location field
}

interface Order {
  id: number;
  status: string;
  tokenNumber: string;
  userId: number;
  deliveryScheduleId: number | null;
  outletId: number;
  orderGasList: OrderGas[];
  total: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule]
})
export class OrderComponent implements OnInit {
  paymentSuccess: boolean = false; // To show success popup
  paymentFailed: boolean = false; // To handle failed payments
  isLoading: boolean = false;
  paypalPaymentId: string = '';
  processingPayment: boolean = false;
  currentStep: number = 1;
  totalSteps: number = 4;
  customerForm!: FormGroup;
  gasSelectionForm!: FormGroup;
  locationForm!: FormGroup;
  paymentForm!: FormGroup;
  availableGases: Gas[] = [];
  selectedGases: OrderGas[] = [];
  outlets: any[] = [];
  showTokenPopup: boolean = false;
  generatedToken: string = '';
  tokenKey: string = '';
  orderId: number = 2;
  order: Order = {
    id: 0,
    status: '',
    tokenNumber: '',
    userId: 0,
    deliveryScheduleId: null,
    outletId: 0,
    orderGasList: [],
    total: 0
  };
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loginService: LoginService,
    private paypalService: PaypalService, private router: Router,
    private orderService: OrderService
  ) {


  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadOutlets();
    this.loadGases();
    this.showStep(this.currentStep);
    this.loadUserDetails();
    this.loadOrderDetails();
  }

  loadOutlets(): void {
    this.orderService.getAllOutlets().subscribe((data: any[]) => {
      this.outlets = data;
    });
  }


  incrementQuantity() {
    const currentValue = this.gasSelectionForm.get('quantity')?.value || 0;
    this.gasSelectionForm.patchValue({ quantity: currentValue + 1 });
  }
  
  decrementQuantity() {
    const currentValue = this.gasSelectionForm.get('quantity')?.value || 0;
    if (currentValue > 1) {
      this.gasSelectionForm.patchValue({ quantity: currentValue - 1 });
    }
  }

  onPurchase(): void {
    const selectedGas = this.availableGases.find(gas => gas.id === this.gasSelectionForm.get('gasId')?.value);
    if (!selectedGas) {
      console.error("No gas selected");
      return;
    }

    const paymentDetails = {
      price: selectedGas.price,
      currency: 'USD',
      method: 'paypal',
      intent: 'sale',
      description: `Payment for gas: ${selectedGas.capacity} KG`
    };

    this.paypalService.createPayment(paymentDetails).subscribe({
      next: (response) => {
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      },
      error: (err) => {
        console.error("Payment failed", err);
      }
    });
  }
  private calculateTotalAmount(): number {
    return this.selectedGases.reduce((total, gasOrder) => {
      const gas = this.availableGases.find(g => g.id === gasOrder.gasId);
      return total + (gas ? gas.price * gasOrder.quantity : 0);
    }, 0);
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private handlePaymentError(error: any): void {
    console.error('Payment error:', error);
    this.paymentFailed = true;
    setTimeout(() => {
      this.paymentFailed = false;
    }, 3000);
  }

  // Method to verify payment status after PayPal redirect
  verifyPaypalPayment(paymentId: string): void {
    this.paypalService.verifyPayment(paymentId).subscribe({
      next: (response) => {
        if (response.status === 'completed') {
          this.onPaymentSuccess();
          this.completeOrder();
        } else {
          this.handlePaymentError('Payment verification failed');
        }
      },
      error: (error) => {
        this.handlePaymentError(error);
      }
    });
  }

  // Modify the existing onPaymentSuccess method
  onPaymentSuccess(): void {
    this.paymentSuccess = true;
    this.processingPayment = false;
    setTimeout(() => {
      this.paymentSuccess = false;
      this.router.navigate(['/order']);
    }, 3000);
  }


  loadGases(): void {
    this.orderService.getAllGases().subscribe((data: Gas[]) => {
      this.availableGases = data;
    });
  }

  private loadUserDetails() {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.loginService.searchById(user.id).subscribe({
        next: (userData) => {
          this.customerForm.patchValue({
            name: userData.name,
            email: userData.email,
            mobileNumber: userData.contactNo,
            userId: userData.id
          });
          console.log('Loaded user details:', userData);
        },
        error: (error) => console.error('Error loading user details:', error)
      });
    }
  }

  private initializeForms() {
    this.customerForm = this.fb.group({
      name: [''],
      mobileNumber: [''],
      email: [''],
      userId: ['']
    });

    this.gasSelectionForm = this.fb.group({
      gasId: [''],
      quantity: [1],
      hasEmptyCylinder: [false],
      outletId: [''],
      location: ['']  // Add location control
    });

    this.locationForm = this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      postalCode: [''],
      deliveryDate: [''],
      deliveryTime: ['']
    });

    this.paymentForm = this.fb.group({
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      nameOnCard: [''],
      paymentMethod: ['card']
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Log current step data before moving to next step
      this.logStepData(this.currentStep);
      this.currentStep++;
    }
  }

  private logStepData(step: number) {
    switch (step) {
      case 1:
        console.log('Customer Details:', {
          formValues: this.customerForm.value,
          formStatus: this.customerForm.status,
          formValid: this.customerForm.valid
        });
        break;
      case 2:
        console.log('Gas Selection:', {
          formValues: this.gasSelectionForm.value,
          selectedGases: this.selectedGases,
          formStatus: this.gasSelectionForm.status,
          formValid: this.gasSelectionForm.valid
        });
        break;
      case 3:
        console.log('Location Details:', {
          formValues: this.locationForm.value,
          formStatus: this.locationForm.status,
          formValid: this.locationForm.valid
        });
        break;
    }
  }

  public validateCurrentStep(): boolean {
    return true; // Simplified validation - always returns true
  }

  completeOrder(): void {
    const orderData = {
      // Customer Details
      customer: {
        ...this.customerForm.value
      },
      // Gas Selection
      gasSelection: {
        outletId: this.gasSelectionForm.get('outletId')?.value,
        hasEmptyCylinder: this.gasSelectionForm.get('hasEmptyCylinder')?.value,
        selectedGases: this.selectedGases
      },
      // Delivery Details
      delivery: {
        address: {
          addressLine1: this.locationForm.get('addressLine1')?.value,
          addressLine2: this.locationForm.get('addressLine2')?.value,
          city: this.locationForm.get('city')?.value,
          postalCode: this.locationForm.get('postalCode')?.value
        },
        date: this.locationForm.get('deliveryDate')?.value,
        timeSlot: this.locationForm.get('deliveryTime')?.value
      },
      // Payment Details
      payment: {
        method: this.paymentForm.get('paymentMethod')?.value,
        details: this.paymentForm.get('paymentMethod')?.value === 'card' ? {
          cardNumber: this.paymentForm.get('cardNumber')?.value,
          expiryDate: this.paymentForm.get('expiryDate')?.value,
          cvv: this.paymentForm.get('cvv')?.value,
          nameOnCard: this.paymentForm.get('nameOnCard')?.value
        } : null
      },
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Log the complete order data
    console.log('Complete Order Data:', orderData);
    console.log('Form States:', {
      customerForm: {
        value: this.customerForm.value,
        valid: this.customerForm.valid,
        touched: this.customerForm.touched
      },
      gasSelectionForm: {
        value: this.gasSelectionForm.value,
        valid: this.gasSelectionForm.valid,
        touched: this.gasSelectionForm.touched
      },
      locationForm: {
        value: this.locationForm.value,
        valid: this.locationForm.valid,
        touched: this.locationForm.touched
      },
      paymentForm: {
        value: this.paymentForm.value,
        valid: this.paymentForm.valid,
        touched: this.paymentForm.touched
      }
    });
  }

seeToken(orderId: number): void {
  this.orderService.getOrderById(orderId).subscribe({
    next: (tokenResponse) => {
      this.generatedToken = tokenResponse.token; // Assuming the tokenResponse contains the token
      this.showTokenPopup = true;
    },
    error: (err) => {
      console.error('Error fetching order by ID:', err);
    }
  });
}

generateToken(): void {
  // Simple alert when token is generated
  alert('Token Generated Successfully!');
  
  // Keep the existing token generation logic
  const tokenObject = {
    userId: this.customerForm.get('userId')?.value,
    outletId: this.gasSelectionForm.get('outletId')?.value,
    orderGasList: this.selectedGases.map(gas => ({
      gasId: gas.gasId,
      quantity: gas.quantity
    }))
  };

  this.orderService.createScheduleOrder(tokenObject).subscribe({
    next: (response) => {
      const orderId = response.orderId;
      console.log('Order created successfully:', orderId);
    },
    error: (err) => {
      console.error('Error generating token:', err);
    }
  });
}

fetchTokenNumber(orderId: number): void {
  this.orderService.getToken(orderId).subscribe(
    (order: { tokenNumber: string; }) => {
      this.generatedToken = order.tokenNumber; // Assuming the response contains tokenNumber
      this.tokenKey = `New Token Key: ${this.generatedToken}`; // Set your custom token key
      this.showTokenPopup = true; // Show the popup
    },
    (error: any) => {
      console.error('Error fetching order:', error);
    }
  );
}

copyToken(): void {
  console.log(`Token Key: ${this.tokenKey}`);
  const inputElement = document.createElement('input');
  inputElement.value = this.generatedToken;
  document.body.appendChild(inputElement);
  inputElement.select();
  document.execCommand('copy');
  document.body.removeChild(inputElement);
  alert('Token copied to clipboard!');
}

closeTokenPopup(): void {
  this.showTokenPopup = false;
}

  addGasToOrder() {
    const gasForm = this.gasSelectionForm.value;
    const selectedGas = this.availableGases.find(g => g.id === gasForm.selectedGasId);

    if (selectedGas && gasForm.quantity <= selectedGas.stock) {
      this.selectedGases.push({
        gasId: gasForm.selectedGasId,
        quantity: gasForm.quantity,
        location: gasForm.location  // Include location in the order
      });

      this.gasSelectionForm.patchValue({
        selectedGasId: '',
        quantity: 1,
        location: ''  // Reset location field
      });

      // Log updated gas selection
      console.log('Updated Gas Selection:', {
        selectedGases: this.selectedGases,
        formValues: this.gasSelectionForm.value
      });
    }
  }

  removeGasFromOrder(index: number) {
    this.selectedGases.splice(index, 1);
    // Log updated gas selection after removal
    console.log('Updated Gas Selection after removal:', {
      selectedGases: this.selectedGases
    });
  }

  showStep(step: number): void {
    this.currentStep = step;
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      // Log data when moving back
      this.logStepData(this.currentStep);
    }
  }

  isStepActive(step: number): boolean {
    return step <= this.currentStep;
  }

  async downloadCoursePDF(order: Order): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(18);
    doc.text('Order Token Key', pageWidth / 2, 20, { align: 'center' });
    let currentY = 40;
    const lineHeight = 10;
    doc.setFontSize(12);
    doc.text(`Token Key: ${this.tokenKey}`, 20, currentY);
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 20, doc.internal.pageSize.height - 20);
    doc.save(`Order_Token_Key.pdf`);
  }

  // Method to be called when the button is clicked
  onDownloadClick(): void {
    this.downloadCoursePDF(this.order);
  }

  // Method to load order details after completion
  loadOrderDetails(): void {
    this.orderService.getAllOrders().subscribe((orders: any[]) => {
      if (orders.length > 0) {
        const latestOrder = orders[0]; // Assuming the latest order is the first one
        this.order = {
          id: latestOrder.id,
          status: latestOrder.status,
          tokenNumber: latestOrder.tokenNumber,
          userId: latestOrder.userId,
          deliveryScheduleId: latestOrder.deliveryScheduleId,
          outletId: latestOrder.outletId,
          orderGasList: latestOrder.orderGasList,
          total: latestOrder.total
        };
      }
    });
  }

  // Add these new methods
  calculateSubtotal(): number {
    return this.selectedGases.reduce((total, gas) => {
      const gasItem = this.availableGases.find(g => g.id === gas.gasId);
      return total + (gasItem ? gasItem.price * gas.quantity : 0);
    }, 0);
  }

  get deliveryFee(): number {
    return 50; // Fixed delivery fee
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.deliveryFee;
  }

  selectPaymentMethod(method: string): void {
    this.paymentForm.patchValue({ paymentMethod: method });
  }
}
