import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  // isSuperAdmin: boolean = false;
  isAdmin = 'false'

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin') ?? 'false')
  }

  signOut() {
    const macAddress = localStorage.getItem("mac_address"); 
    localStorage.removeItem('isAdmin');
  
    if (macAddress) {
      this.router.navigate(['/login'], { queryParams: { mac: macAddress } });
    } else {
      this.router.navigate(['/login']);
    }
  }
  

}
