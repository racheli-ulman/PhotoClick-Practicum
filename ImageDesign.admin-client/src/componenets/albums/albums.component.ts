import { Component } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { Router } from '@angular/router';
import { Album } from '../../models/album';
import { MatCardModule } from '@angular/material/card'; // הוספת ייבוא של MatCardModule


@Component({
  selector: 'app-albums',
  imports: [MatCardModule],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {
albums: Album[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private albumService: AlbumService, private router: Router) {}

  ngOnInit(): void {
    console.log("albums component initialized");
    
    this.albumService.getAllAlbums().subscribe({
      next: (data) => {
        this.albums = data;
        this.isLoading = false;
        console.log("albums loaded", this.albums.length);
      },
      error: (error) => {
        this.errorMessage = 'לא ניתן לטעון את האלבומים';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
}