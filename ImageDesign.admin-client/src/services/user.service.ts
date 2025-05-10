import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUser, MonthlyRegistrationsDto, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl = 'http://localhost:5083/api/User';

  constructor(private http: HttpClient) { }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
    // return this.http.get(`${this.baseUrl}`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
  // Add a user
  addUser(user: AddUser): Observable<AddUser> {
    return this.http.post(`${this.baseUrl}`, user);
  }

  // Delete a user by ID
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }

  updateUser(userId: number, updates: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, updates)
  }
  // UserService
  getMonthlyRegistrations(): Observable<MonthlyRegistrationsDto[]> {
    return this.http.get<MonthlyRegistrationsDto[]>(`${this.baseUrl}/registrations-per-month`);
  }

}