import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseUrl = 'http://localhost:5083/api/Album';

  constructor(private http: HttpClient) { }

  // Get all users
getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}`);
    // return this.http.get(`${this.baseUrl}`);
  }
}
