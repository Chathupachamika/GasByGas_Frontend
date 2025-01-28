import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  capacity: number;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, ReactiveFormsModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: 'Regular Gas Cylinder',
      capacity: 12.5,
      price: 49.99,
      stock: 15
    },
    {
      id: 2,
      name: 'Premium Gas Cylinder',
      capacity: 37.5,
      price: 129.99,
      stock: 8
    },
    {
      id: 3,
      name: 'Small Gas Cylinder',
      capacity: 5.0,
      price: 24.99,
      stock: 20
    },
    {
      id: 4,
      name: 'Industrial Gas Cylinder',
      capacity: 50.0,
      price: 199.99,
      stock: 5
    }
  ];

  showAddProductModal = false;
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void { }

  addNewProduct() {
    this.showAddProductModal = true;
  }

  submitProduct() {
    if (this.productForm.valid) {
      const newProduct = {
        id: this.products.length + 1,
        ...this.productForm.value
      };
      this.products.push(newProduct);
      this.showAddProductModal = false;
      this.productForm.reset();
    }
  }

  closeModal() {
    this.showAddProductModal = false;
    this.productForm.reset();
  }
}
