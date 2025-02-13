import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
   macAddress = 'XX:XX:XX:XX:XX:XX'; 
  constructor (private router: Router,  private route: ActivatedRoute) {}
  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const mac_address = params['mac'];
        // console.log(this.macAddress)
        if (mac_address) {
          this.macAddress = mac_address;
         
        }
      });
    }

  navigateToLogin() {
   
    this.router.navigate(['/login'], { queryParams: { mac: this.macAddress } });
  };
}
