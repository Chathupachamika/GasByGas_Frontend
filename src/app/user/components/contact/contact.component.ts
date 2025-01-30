import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarUserComponent } from "../../sidebar-user/sidebar-user.component";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarUserComponent, HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add your form submission logic here
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
