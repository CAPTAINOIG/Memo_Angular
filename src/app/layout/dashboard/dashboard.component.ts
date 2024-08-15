import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebargroupComponent } from '../../page/sidebargroup/sidebargroup.component';
import { SidebarformsComponent } from '../../page/sidebarforms/sidebarforms.component';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [RouterModule,HeaderComponent,SidebargroupComponent,SidebarformsComponent],
})
export class DashboardComponent {
  prop:boolean=false;
  handleClick=(data:any)=>{
    this.prop=!this.prop
  }


}
