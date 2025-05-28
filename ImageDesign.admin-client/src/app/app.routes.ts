import { Routes } from '@angular/router';
import { LoginComponent } from '../componenets/login/login.component';
import { ShowUsersComponent } from '../componenets/show-users/show-users.component';
import { HomeComponent } from '../componenets/home/home.component';
import { AddUserComponent } from '../componenets/add-user/add-user.component';
import { StatisticsComponent } from '../componenets/statistics/statistics.component';
import { AlbumsComponent } from '../componenets/albums/albums.component';
import { PhotosComponent } from '../componenets/photos/photos.component';
import { DashboardComponent } from '../componenets/dashboard/dashboard.component';
// import { EditUserModalComponent } from '../componenets/edit-user-modal/edit-user-modal.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:"home",component:HomeComponent,children:
    [
        {path:'show-users',component:ShowUsersComponent},
        {path:'add-user',component:AddUserComponent},
        {path:'statistics',component:StatisticsComponent},
        {path:'count-of-albums',component:AlbumsComponent},
        {path:'count-of-photos',component:PhotosComponent},
        { path: 'dashboard', component: DashboardComponent },
        // { path: 'edit-user/:id', component: EditUserModalComponent }, // ודא שהנתיב הזה קיים




    ]},
];
