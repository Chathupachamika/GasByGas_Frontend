import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GasDTO } from '../../../model/gas.model';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import {  ProductService } from '../../../service/product.service';

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
  imports: [CommonModule, SidebarComponent, ReactiveFormsModule, HttpClientModule]
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
  showEditProductModal = false;
  selectedProduct: Product | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      capacity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products.map(product => ({
          id: product.id ?? 0, // Ensure id is a number
          name: product.name,
          capacity: product.capacity,
          price: product.price,
          stock: product.stock
        }));
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  addNewProduct() {
    this.showAddProductModal = true;
  }

  submitProduct() {
    if (this.productForm.valid) {
      console.log('Form is valid, preparing to submit:', this.productForm.value);

      const formValue = this.productForm.value;
      const newProduct: GasDTO = {
        name: `Gas Cylinder ${formValue.capacity}kg`,
        capacity: Number(formValue.capacity),
        price: Number(formValue.price),
        stock: Number(formValue.stock)
      };

      console.log('Sending product to backend:', newProduct);

      this.productService.createProduct(newProduct)
        .subscribe({
          next: (createdProduct) => {
            console.log('Product created successfully:', createdProduct);
            this.products.push({
              id: createdProduct.id ?? this.products.length + 1,
              name: createdProduct.name,
              capacity: createdProduct.capacity,
              price: createdProduct.price,
              stock: createdProduct.stock
            });
            this.showAddProductModal = false;
            this.productForm.reset();
            // Add success alert
            alert('Product added successfully!');
          },
          error: (error) => {
            console.error('Error creating product:', error);
            alert('Failed to create product. Please try again.');
          }
        });
    } else {
      console.log('Form is invalid:', this.productForm.errors);
    }
  }

  closeModal() {
    this.showAddProductModal = false;
    this.productForm.reset();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = product;
    this.productForm.patchValue({
      capacity: product.capacity,
      price: product.price,
      stock: product.stock
    });
    this.showEditProductModal = true;
  }

  updateProduct() {
    if (this.productForm.valid && this.selectedProduct) {
      const formValue = this.productForm.value;
      const updatedProduct: GasDTO = {
        id: this.selectedProduct.id,
        name: this.selectedProduct.name,
        capacity: Number(formValue.capacity),
        price: Number(formValue.price),
        stock: Number(formValue.stock)
      };

      this.productService.updateProduct(this.selectedProduct.id, updatedProduct)
        .subscribe({
          next: (updated) => {
            const index = this.products.findIndex(p => p.id === updated.id);
            if (index !== -1) {
              this.products[index] = {
                ...this.products[index],
                ...updated
              };
            }
            this.closeEditModal();
            alert('Product updated successfully!');
          },
          error: (error) => {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
          }
        });
    }
  }

  closeEditModal() {
    this.showEditProductModal = false;
    this.selectedProduct = null;
    this.productForm.reset();
  }
}
