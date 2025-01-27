import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderComponent } from "../../common/header/header.component";
import { SidebarComponent } from "../../common/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // added to recognize custom elements
})
export class DashboardComponent {

}
