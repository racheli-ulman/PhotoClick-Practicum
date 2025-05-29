import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PhotosService {

 
   private baseUrl = `${environment.apiUrl}/Photo`; // URL של ה-API שלך
 
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

}
