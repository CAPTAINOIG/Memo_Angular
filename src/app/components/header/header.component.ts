import { Component } from '@angular/core';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  userDetail: any;
  user: any = {};
 
  constructor(private sidebarService: ServicesidebarService, private httpRequet: HttpRequestService){ }
 
  ngOnInit(): void{ 
     this.httpRequet.makeGetRequest('/auth/user').subscribe((response)=>{
      this.user = response.data;
      this.sidebarService.setUserData(response.data)
    }, (error)=>{
    })
}

  
}
