import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [FormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  isDialogOpen = false;
  collector = {
    id: '',
    capacity: '',
    price: '',
    stock: ''
  };

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

  addCollector(): void {
    console.log(this.collector);
    // Logic to add the gas collector
    this.closeDialog(); // Close the dialog after adding
  }
}
