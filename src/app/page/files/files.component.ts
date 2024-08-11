import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {

}
