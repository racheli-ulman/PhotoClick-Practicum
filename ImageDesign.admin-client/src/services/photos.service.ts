import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

 
   private baseUrl = 'http://localhost:5083/api/Photo';
 
   constructor(private http: HttpClient) { }
 
   // Get all users
  getAllPhotos(): Observable<Photo[]> {
     return this.http.get<Photo[]>(`${this.baseUrl}`);
     // return this.http.get(`${this.baseUrl}`);
   }
   getDeletedPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/deleted-photos`);
    // return this.http.get(`${this.baseUrl}`);
  }
  getPhotosByTagId(tagId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/tag/${tagId}`);
  }

}
