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
  // isSuperAdmin: boolean = false;
 isAdmin = 'false'
  
  constructor (
    private router: Router,
  ) { }
  
  ngOnInit() {
    this.isAdmin=JSON.parse(localStorage.getItem('isAdmin')??'false')
    // const userData = localStorage.getItem('isAdmin');
    // if (userData) {
    //   const user = JSON.parse(userData);
    //   this.isSuperAdmin = user
    // }
  }

  signOut() {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/login']);
    // this.isSuperAdmin = false;
  }
  
}
