import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor (private router: Router) {}

  navigateToLogin() {
    const macAddress = 'XX:XX:XX:XX:XX:XX'; 
    this.router.navigate(['/login'], { queryParams: { mac: macAddress } });
  };
}
