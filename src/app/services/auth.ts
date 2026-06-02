import { Injectable } from '@angular/core';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  register(data: any) {
    return this.api.post('auth/register', data);
  }

  verifyOtp(userId: string, otp: string) {
    return this.api.post('auth/verify-otp', { userId, otp });
  }

  login(email: string, password: string) {
    return this.api.post<any>('auth/login', { email, password });
  }

  saveToken(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || 'CLIENT';
  }

  updateUser(user: any) {
    localStorage.setItem('current_user', JSON.stringify(user));
  }
}