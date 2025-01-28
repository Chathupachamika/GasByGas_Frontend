import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../service/login.service';

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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule]
})
export class OrderComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 4;
  customerForm!: FormGroup;
  gasSelectionForm!: FormGroup;
  locationForm!: FormGroup;
  paymentForm!: FormGroup;
  availableGases: Gas[] = [];
  selectedGases: OrderGas[] = [];
  outlets: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.showStep(this.currentStep);
    this.loadUserDetails();
  }

  private loadUserDetails() {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.loginService.searchById(user.id).subscribe({
        next: (userData) => {
          this.customerForm.patchValue({
            firstName: userData.name,
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
      firstName: [''],
      lastName: [''],
      mobileNumber: [''],
      email: [''],
      userId: ['']
    });

    this.gasSelectionForm = this.fb.group({
      selectedGasId: [''],
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
}