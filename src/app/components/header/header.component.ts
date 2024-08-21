import { Component } from '@angular/core';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userDetail: any;
  user: any = {};
  // @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  // handleClick() {
  //   const data = 'Hello from Child!';
  //   this.dataEmitter.emit(data); // Emit the data to the parent
  // }
  constructor(private sidebarService: ServicesidebarService, private httpRequet: HttpRequestService){ }
 
  ngOnInit(): void{ 
    // this.userDetail = this.sidebarService.getUserDetail()
    // console.log(this.userDetail);
    const userName = this.httpRequet.makeGetRequest('/auth/user').subscribe((response)=>{
      this.user = response.data;
    }, (error)=>{
      console.log(error);
    })
}

  
}
