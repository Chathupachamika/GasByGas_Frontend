import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './admin/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo-app';
}
