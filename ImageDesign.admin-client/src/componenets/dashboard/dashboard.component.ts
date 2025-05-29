import { Component } from '@angular/core';
import { PhotosComponent } from '../photos/photos.component';
import { AlbumsComponent } from '../albums/albums.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { MatCardModule } from '@angular/material/card'; // הוספת ייבוא של MatCardModule

@Component({
  selector: 'app-dashboard',
  imports: [PhotosComponent, StatisticsComponent,MatCardModule], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
