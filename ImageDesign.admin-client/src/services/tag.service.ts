import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private apiUrl = "http://localhost:5083/api/Tag"

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl)
  }

  getTagById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/${id}`)
  }

  addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, tag)
  }

  updateTag(id: number, tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, tag)
  }

  deleteTag(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
  }

  getTagByName(tagName: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/name/${tagName}`)
  }
}

