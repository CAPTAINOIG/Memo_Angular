import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NavigatingComponent } from "../navigating/navigating.component";
import { LandingpageusersComponent } from "../landingpageusers/landingpageusers.component";
import { AddressblockchainComponent } from "../addressblockchain/addressblockchain.component";

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [NavbarComponent, NavigatingComponent, LandingpageusersComponent, AddressblockchainComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {

}
