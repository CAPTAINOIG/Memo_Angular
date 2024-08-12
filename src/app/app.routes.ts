import { Routes } from '@angular/router';
import { DashboardComponent as DashboardLayout } from './layout/dashboard/dashboard.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LoginComponent } from './page/login/login.component';
import { FilesComponent } from './page/files/files.component';
import { ActivitiesComponent } from './page/activities/activities.component';
import { UsersComponent } from './page/users/users.component';
import { SettingsComponent } from './page/settings/settings.component';
import { TwofactorauthComponent } from './page/twofactorauth/twofactorauth.component';
import { authGuard } from './guards/auth.guard';
import { NewuserComponent } from './page/newuser/newuser.component';

export const routes: Routes = [
    {'path':'', component:LoginComponent},
    {path: 'auth', component: TwofactorauthComponent},
    {'path':'portal', component:DashboardLayout, canActivate:[authGuard], children:[
        {'path':'dashboard', component:DashboardComponent},
        {'path':'files', component:FilesComponent},
        {'path':'activities', component:ActivitiesComponent},
        {'path':'users', component:UsersComponent},
        {'path':'settings', component:SettingsComponent},
        {'path': 'newuser', component: NewuserComponent},
    ]},
];

