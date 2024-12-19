import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isSuperAdmin: boolean = false;

  ngOnInit() {
    const userData = localStorage.getItem('isAdmin');
    console.log( userData);
  
    if (userData) {
      const user = JSON.parse(userData);
      // console.log(user);
  
      this.isSuperAdmin = user
      // console.log(this.isSuperAdmin); 
    }
  }
  
}
