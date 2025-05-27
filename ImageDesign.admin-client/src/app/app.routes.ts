import { Routes } from '@angular/router';
import { LoginComponent } from '../componenets/login/login.component';
import { ShowUsersComponent } from '../componenets/show-users/show-users.component';
import { HomeComponent } from '../componenets/home/home.component';
import { AddUserComponent } from '../componenets/add-user/add-user.component';
import { StatisticsComponent } from '../componenets/statistics/statistics.component';
import { AlbumsComponent } from '../componenets/albums/albums.component';
import { PhotosComponent } from '../componenets/photos/photos.component';
import { DashboardComponent } from '../componenets/dashboard/dashboard.component';
import { AlbumManagementComponent } from '../componenets/album-management/album-management.component';
import { PhotoManagementComponent } from '../componenets/photo-management/photo-management.component';
import { TagManagementComponent } from '../componenets/tag-management/tag-management.component';
import { SystemReportsComponent } from '../componenets/system-reports/system-reports.component';
// import { EditUserModalComponent } from '../componenets/edit-user-modal/edit-user-modal.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:"home",component:HomeComponent,children:
    [
        {path:'show-users',component:ShowUsersComponent},
        {path:'add-user',component:AddUserComponent},
        // {path:'statistics',component:StatisticsComponent},
        {path:'statistics',component:DashboardComponent},
        // {path:'count-of-albums',component:AlbumsComponent},
        {path:'count-of-albums',component:AlbumManagementComponent},
        {path:'count-of-photos',component:PhotosComponent},
        { path: 'dashboard', component: DashboardComponent },
        { path: 'v0', component: PhotoManagementComponent },
        { path: 'claude', component: TagManagementComponent },
        { path: 'ss', component: SystemReportsComponent },
        // { path: 'edit-user/:id', component: EditUserModalComponent }, // ודא שהנתיב הזה קיים




    ]},
];
