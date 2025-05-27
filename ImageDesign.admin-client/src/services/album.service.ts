import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models/album';
import { Photo } from '../models/photo';

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

    getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/${id}`)
  }

  addAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(this.baseUrl, album)
  }

  updateAlbum(id: number, album: Album): Observable<Album> {
    return this.http.put<Album>(`${this.baseUrl}/${id}`, album)
  }

  deleteAlbum(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`)
  }

  getImagesByAlbumId(albumId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/${albumId}/images`)
  }

  getAlbumsByUserId(userId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/user/${userId}`)
  }

  getAllPhotosByUserId(userId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/user/${userId}/photos`)
  }
}
