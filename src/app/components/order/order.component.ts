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
  deliveryScheduleId: number;
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
  showTokenPopup = false;
  generatedToken = '';
  orderId: number = 2;

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
  }

  loadOutlets(): void {
    this.orderService.getAllOutlets().subscribe((data: any[]) => {
      this.outlets = data;
    });
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
  // Creating the token object according to the API structure
  const tokenObject = {
    userId: this.customerForm.get('userId')?.value,
    outletId: this.gasSelectionForm.get('outletId')?.value,
    orderGasList: this.selectedGases.map(gas => ({
      gasId: gas.gasId,
      quantity: gas.quantity
      // Removed location since it's not in your API structure
    }))
  };

  // Log the request object for debugging
  console.log('Token Object:', tokenObject);

  this.orderService.createScheduleOrder(tokenObject).subscribe({
    next: (response) => {
      const orderId = response.orderId;
      console.log('Order created successfully:', orderId);
      // Pass the orderId to seeToken method
    },
    error: (err) => {
      console.error('Error generating token:', err);
      // Handle error here
    }
  });
}

  getToken(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response) => {
        this.generatedToken = response.token; // Ensure this is the correct property
        console.log('Generated Token:', this.generatedToken); // Add console log for token
        this.showTokenPopup = true;
      },
      error: (err) => {
        console.error('Error fetching token:', err);
      }
    });
  }

  copyToken() {
    navigator.clipboard.writeText(this.generatedToken).then(() => {
      alert('Token copied to clipboard');
    });
  }



  closeTokenPopup() {
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

  async downloadTokenPDF(order: Order): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(18);
    doc.text('Order Details', pageWidth / 2, 20, { align: 'center' });
    let currentY = 40;
    const lineHeight = 10;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`Status: ${order.status}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`Token Number: ${order.tokenNumber}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`User ID: ${order.userId}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`Delivery Schedule ID: ${order.deliveryScheduleId}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`Outlet ID: ${order.outletId}`, 40, currentY);
    currentY += lineHeight;

    doc.text(`Total: ${order.total}`, 40, currentY);
    currentY += lineHeight;

    doc.setFontSize(10);
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 20, doc.internal.pageSize.height - 20);
    doc.save(`${order.id.toString().replace(/\s+/g, '_')}_details.pdf`);
  }
}
