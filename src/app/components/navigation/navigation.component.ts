import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isSuperAdmin: boolean = false;

  constructor (
    private router: Router,
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('isAdmin');
    if (userData) {
      const user = JSON.parse(userData);
      this.isSuperAdmin = user
    }
  }

  signOut() {
    localStorage.removeItem('isAdmin');
    this.isSuperAdmin = false;
    this.router.navigate(['/login']);
  }
  
}
