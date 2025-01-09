import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigating',
  standalone: true,
  imports: [],
  templateUrl: './navigating.component.html',
  styleUrl: './navigating.component.css'
})
export class NavigatingComponent {

  constructor(private router: Router) {}

  navigateToLogin() {
  const macAddress = 'XX:XX:XX:XX:XX:XX'; 
  this.router.navigate(['/login'], { queryParams: { mac: macAddress } });
}
}
