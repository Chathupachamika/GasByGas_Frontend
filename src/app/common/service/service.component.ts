import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  services = [
    {
      title: 'Gas Delivery',
      description: 'Quick and reliable gas delivery to your doorstep with real-time tracking',
      icon: '🚛',
      featured: true
    },
    {
      title: 'Installation',
      description: 'Professional gas system installation services by certified experts',
      icon: '🔧',
      featured: false
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for emergency assistance',
      icon: '📞',
      featured: false
    },
    {
      title: 'Maintenance',
      description: 'Regular maintenance and safety checks by qualified technicians',
      icon: '⚡',
      featured: false
    },
    {
      title: 'Safety Inspection',
      description: 'Comprehensive safety audits and compliance checks',
      icon: '🔍',
      featured: false
    },
    {
      title: 'Consultation',
      description: 'Expert advice on gas system optimization and efficiency',
      icon: '💡',
      featured: false
    }
  ];

  features = [
    {
      title: 'Certified Experts',
      description: 'All our technicians are fully certified and experienced',
      icon: '👨‍🔧'
    },
    {
      title: 'Fast Response',
      description: 'Quick response times for all service requests',
      icon: '⚡'
    },
    {
      title: 'Quality Guarantee',
      description: 'We stand behind the quality of our work',
      icon: '✅'
    },
    {
      title: 'Competitive Pricing',
      description: 'Transparent and competitive pricing for all services',
      icon: '💰'
    }
  ];
}
