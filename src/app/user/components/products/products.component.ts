import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { GasDTO } from "../../../model/gas.model";
import { NotificationDTO } from "../../../model/notification.model";
import { CartService } from "../../../service/cart.service";
import { NotificationService } from "../../../service/notification.service";
import { ProductService } from "../../../service/product.service";
import { HeaderComponent } from "../../header/header.component";
import { SidebarUserComponent } from "../../sidebar-user/sidebar-user.component";
import { OrderService } from "../../../service/order.service";
interface Product {
  id: number;
  name: string;
  capacity: number;
  price: number;
  stock: number;
}

interface ProductRequest {
  userName: string;
  contactNumber: string;
  email: string;
  requestDate: string;
}



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderComponent, SidebarUserComponent]
})


export class ProductsComponent implements OnInit {


  get today() {

    return new Date().toISOString().split('T')[0];

  }

  products: Product[] = [
    {
      id: 1,
      name: 'Regular Gas Cylinder',
      capacity: 12.5,
      price: 49.99,
      stock: 0
    },
    {
      id: 2,
      name: 'Premium Gas Cylinder',
      capacity: 37.5,
      price: 129.99,
      stock: 0
    },
    {
      id: 3,
      name: 'Small Gas Cylinder',
      capacity: 5.0,
      price: 24.99,
      stock: 0
    },
    {
      id: 4,
      name: 'Industrial Gas Cylinder',
      capacity: 50.0,
      price: 199.99,
      stock: 0
    }
  ];

  showAddProductModal = false;
  productForm: FormGroup;
  showEditProductModal = false;
  selectedProduct: Product | null = null;
  showRequestModal = false;
  requestForm: FormGroup;
  selectedRequestProduct: Product | null = null;
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      capacity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
    this.requestForm = this.fb.group({
      userName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      requestDate: ['', [Validators.required]]
    });

    // Get user details from localStorage
    const userDetailsStr = localStorage.getItem('userDetails');
    this.userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;
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
      const formValue = this.productForm.value;
      const newProduct: GasDTO = {
        name: `Gas Cylinder ${formValue.capacity}kg`, // Automatically generate name
        capacity: Number(formValue.capacity),
        price: Number(formValue.price),
        stock: Number(formValue.stock)
      };

      Swal.fire({
        title: 'Creating Product',
        text: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        position: 'center',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.productService.createProduct(newProduct)
        .subscribe({
          next: (createdProduct) => {
            this.products.push({
              id: createdProduct.id ?? this.products.length + 1,
              name: createdProduct.name,
              capacity: createdProduct.capacity,
              price: createdProduct.price,
              stock: createdProduct.stock
            });
            this.showAddProductModal = false;
            this.productForm.reset();

            Swal.fire({
              icon: 'success',
              title: 'Product Added!',
              text: 'The product has been created successfully.',
              timer: 2000,
              position: 'center',
              showConfirmButton: false
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Creation Failed',
              text: 'There was an error creating the product. Please try again.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#4f46e5',
              position: 'center'
            });
          }
        });
    }
  }

  closeModal() {
    this.showAddProductModal = false;
    this.productForm.reset();
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#4f46e5',
      reverseButtons: true,
      position: 'center'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          showConfirmButton: false,
          position: 'center',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter(product => product.id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been removed.',
              timer: 2000,
              position: 'center',
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: 'There was an error deleting the product.',
              confirmButtonColor: '#4f46e5',
              position: 'center'
            });
          }
        });
      }
    });
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

      Swal.fire({
        title: 'Updating Product',
        text: 'Please wait...',
        showConfirmButton: false,
        position: 'center',
        didOpen: () => {
          Swal.showLoading();
        }
      });

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

            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              text: 'Product details have been updated.',
              timer: 2000,
              position: 'center',
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'There was an error updating the product.',
              confirmButtonColor: '#4f46e5',
              position: 'center'
            });
          }
        });
    }
  }

  closeEditModal() {
    this.showEditProductModal = false;
    this.selectedProduct = null;
    this.productForm.reset();
  }

  updateStockToZero(product: Product) {
    Swal.fire({
      title: 'Empty Stock?',
      text: 'Are you sure you want to set this product stock to zero?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, empty it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#4f46e5',
      reverseButtons: true,
      position: 'center'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating Stock...',
          text: 'Please wait...',
          showConfirmButton: false,
          position: 'center',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.productService.updateStockToZero(product.id)
          .subscribe({
            next: (updated) => {
              const index = this.products.findIndex(p => p.id === updated.id);
              if (index !== -1) {
                this.products[index] = {
                  ...this.products[index],
                  stock: 0
                };
              }

              Swal.fire({
                icon: 'success',
                title: 'Stock Updated',
                text: 'Product stock has been set to zero.',
                timer: 2000,
                position: 'center',
                showConfirmButton: false
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating the stock.',
                confirmButtonColor: '#4f46e5',
                position: 'center'
              });
            }
          });
      }
    });
  }

  addToCart(product: GasDTO) {
    this.cartService.addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: 'Product has been added to your cart',
      timer: 1500,
      showConfirmButton: false
    });
  }

  navigateToOrder(product: Product) {
    this.router.navigate(['/order'], {
      queryParams: {
        productId: product.id,
        productName: product.name,
        price: product.price
      }
    });
  }

  requestProduct(product: Product) {
    this.selectedRequestProduct = product;
    this.showRequestModal = true;

    // Pre-fill the form with user details if available
    if (this.userDetails) {
        this.requestForm.patchValue({
            userName: this.userDetails.name || this.userDetails.userName,
            // Convert contactNo to string and ensure it's a 10-digit number
            contactNumber: this.userDetails.contactNo?.toString().padStart(10, '0') || '',
            email: this.userDetails.email
        });
    }
  }

  submitRequest() {
    if (this.requestForm.valid && this.selectedRequestProduct) {
      const notification: NotificationDTO = {
        name: this.requestForm.value.userName,
        contactNumber: this.requestForm.value.contactNumber,
        email: this.requestForm.value.email,
        preferredDate: this.requestForm.value.requestDate,
        gasCapacity: this.selectedRequestProduct.capacity  // Add the gas capacity
      };

      Swal.fire({
        title: 'Submitting Request...',
        text: 'Please wait',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.notificationService.createNotification(notification).subscribe({
        next: () => {
          Swal.fire({
            title: 'Request Submitted!',
            text: `We will notify you when ${this.selectedRequestProduct?.name} (${this.selectedRequestProduct?.capacity}kg) becomes available.`,
            icon: 'success',
            timer: 2000,
            position: 'center',
            showConfirmButton: false
          });
          this.closeRequestModal();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to submit request. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  closeRequestModal() {
    this.showRequestModal = false;
    this.selectedRequestProduct = null;
    this.requestForm.reset();
  }
}
