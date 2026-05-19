import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export const API_URL = 'http://localhost:3000/api/v1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${API_URL}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${API_URL}/${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  patch<T>(endpoint: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${API_URL}/${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${API_URL}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }
}