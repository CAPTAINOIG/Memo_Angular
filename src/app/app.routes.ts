import { Routes } from '@angular/router';
import { DashboardComponent as DashboardLayout } from './layout/dashboard/dashboard.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LoginComponent } from './page/login/login.component';
import { FilesComponent } from './page/files/files.component';
import { ActivitiesComponent } from './page/activities/activities.component';
import { UsersComponent } from './page/users/users.component';
import { SettingsComponent } from './page/settings/settings.component';
import { TwofactorauthComponent } from './page/twofactorauth/twofactorauth.component';
import { authGuard,isAdminGaurd } from './guards/auth.guard';
// import { authGuard,isAdminGaurd } from './guards/auth.guard';
import { NewuserComponent } from './page/newuser/newuser.component';
import { SecurityCheckComponent } from './page/security-check/security-check.component';
import { ExternalViewerComponent } from './external-viewer/external-viewer.component';
import { PagenotfoundComponent } from './page/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './page/forgotpassword/forgotpassword.component';
import { PasswordauthComponent } from './page/passwordauth/passwordauth.component';
import { PasswordresetComponent } from './page/passwordreset/passwordreset.component';
import { AdminLayoutComponent} from './layout/isAdminLayout/dashboard.component'
import { FolderComponent } from './folder/folder.component';


export const routes: Routes = [
    { path: 'viewer/:id', component: ExternalViewerComponent },
    { path: '**', redirectTo: 'viewer/b3ccc41a-8d1b-47b2-9383-423bb1027410' },
    // {'path': '', component: FolderComponent},
    // {'path':'login', component:LoginComponent},
    // {path: 'auth', component: TwofactorauthComponent},
    // {'path':'forgotpassword', component: ForgotpasswordComponent},
    // {path: 'passwordAuth', component: PasswordauthComponent},
    // {'path': 'resetPassword', component: PasswordresetComponent},
    // {'path':'portal', component:DashboardLayout, canActivate:[authGuard], children:[
    //     {'path':'dashboard', component:DashboardComponent},
    //     {'path':'files', component:FilesComponent},
    //     {path:"",component:AdminLayoutComponent, canActivate:[isAdminGaurd], children:[
    //         {'path':'activities', component:ActivitiesComponent},
    //         {'path':'users', component:UsersComponent},
    //         {'path':'settings', component:SettingsComponent},
    //         {'path': 'newuser', component: NewuserComponent},
    //     ]}
    // ]},
    // {'path': 'securitycheck', component: SecurityCheckComponent},
    // {'path': 'viewer/:id', component: ExternalViewerComponent},
    // { path: 'errorpage', component: PagenotfoundComponent },
    // { path: '**', redirectTo: '/errorpage' } 
];

