import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5099/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  private loggedIn = false;

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }


  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
  return localStorage.getItem('auth_token');
  
}


getUsernameFromToken(): string {
  const token = localStorage.getItem('token');
  if (!token) return 'Utilisateur';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'Utilisateur';
  } catch (e) {
    console.error('JWT parsing error', e);
    return 'Utilisateur';
  }
}

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
