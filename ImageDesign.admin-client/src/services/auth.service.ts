import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5083/api/Auth'; // כאן תשים את ה-URL של ה-API שלך

  constructor(private http: HttpClient) { }
  // register(firstName: string, lastName: string, email: string, password: string, roleName: string): Observable<any> {
  //   const user = { firstName, lastName, email, password, roleName };
  //   return this.http.post(`${this.apiUrl}/register`, user);
  // }

  login(email: string, password: string): Observable<any> {
    const adminDetails = { email, password };
    return this.http.post(`${this.apiUrl}/login`, adminDetails);
  }

}
