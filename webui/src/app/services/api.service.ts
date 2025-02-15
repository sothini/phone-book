import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Contact, ContactsResponse } from '../models/contact.model';
import { Message, MessagesResponse } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:9001/api/';

  constructor(private http: HttpClient) { }

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.apiUrl + 'login', { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getContacts(): Observable<Contact[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ContactsResponse>(this.apiUrl + 'contacts', { headers }).pipe(
      map(response => response.data)
    );
  }

  getMessages(): Observable<Message[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<MessagesResponse>(this.apiUrl + 'messages', { headers }).pipe(
      map(response => response.data)
    );
  }

  updateProfile(name: string, email: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return this.http.put<any>(this.apiUrl + 'me/update' , {user,name, email },{headers}).pipe(
      tap((response: any) => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          return true;
        } else {
          return false;
        }
      })
    );
  }

  updatePassword(current_password: string, new_password: string,confirm_password:string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return this.http.post<any>(this.apiUrl + 'me/update-password' , {user,current_password, new_password,confirm_password },
      {headers}).pipe(
      tap((response: any) => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
