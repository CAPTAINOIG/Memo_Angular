import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsermodalComponent } from "../../page/usermodal/usermodal.component";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, UsermodalComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

}
