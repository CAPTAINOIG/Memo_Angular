import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NavigatingComponent } from "../navigating/navigating.component";
import { LandingpageusersComponent } from "../landingpageusers/landingpageusers.component";
import { AddressblockchainComponent } from "../addressblockchain/addressblockchain.component";
import { CompetitorComponent } from "../competitor/competitor.component";
import { PlatformComponent } from "../platform/platform.component";
import { TokenComponent } from "../token/token.component";
import { BonusComponent } from "../bonus/bonus.component";
import { TeamComponent } from "../team/team.component";
import { DistributionComponent } from "../distribution/distribution.component";
import { FooterComponent } from "../footer/footer.component";
import { PartnerComponent } from "../partner/partner.component";
import { QuestionComponent } from "../question/question.component";

@Component({
    selector: 'app-folder',
    imports: [NavbarComponent, NavigatingComponent, LandingpageusersComponent, AddressblockchainComponent],
    templateUrl: './folder.component.html',
    styleUrl: './folder.component.css',
    standalone: true,
})
export class FolderComponent {

}
