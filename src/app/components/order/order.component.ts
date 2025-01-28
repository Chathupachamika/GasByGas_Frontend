import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [SidebarComponent]
  
})
export class OrderComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 4;

  constructor() { }

  ngOnInit(): void {
    this.showStep(this.currentStep);
    this.setupEventListeners();
  }

  showStep(step: number): void {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
    // Show current step
    document.getElementById(`step${step}`)?.classList.remove('hidden');

    // Update progress indicators
    document.querySelectorAll('.step-item').forEach((el, index) => {
      if (index + 1 <= step) {
        el.classList.add('text-blue-600');
        el.querySelector('div')?.classList.add('bg-blue-600', 'text-white');
        el.querySelector('div')?.classList.remove('bg-gray-200');
      } else {
        el.classList.remove('text-blue-600');
        el.querySelector('div')?.classList.remove('bg-blue-600', 'text-white');
        el.querySelector('div')?.classList.add('bg-gray-200');
      }
    });
  }

  setupEventListeners(): void {
    document.querySelectorAll('.next-step').forEach(el => {
      el.addEventListener('click', () => {
        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.showStep(this.currentStep);
        }
      });
    });

    document.querySelectorAll('.prev-step').forEach(el => {
      el.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.showStep(this.currentStep);
        }
      });
    });
  }
}
