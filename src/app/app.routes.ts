import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FilesComponent } from './files/files.component';
import { ActivitiesComponent } from './activities/activities.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {'path':'portal/dashboard', component:DashboardComponent},
    {'path':'login', component:LoginComponent},
    {'path':'files', component:FilesComponent},
    {'path':'activities', component:ActivitiesComponent},
    {'path':'users', component:UsersComponent},
    {path:'settings', component:SettingsComponent}
];

