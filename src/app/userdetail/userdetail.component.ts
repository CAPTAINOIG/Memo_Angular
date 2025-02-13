import { Component } from '@angular/core';
import { ServicesidebarService } from '../service/servicesidebar.service';

@Component({
    selector: 'app-userdetail',
    imports: [],
    standalone: true,
    templateUrl: './userdetail.component.html',
    styleUrl: './userdetail.component.css'
})
export class UserdetailComponent {
  userData: any

  constructor(private sidebarService: ServicesidebarService) {}

  ngOnInit() {
    this.userData = this.sidebarService.getUserData();
    console.log(this.userData);
  }
}
