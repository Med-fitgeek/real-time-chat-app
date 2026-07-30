import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'username';

  // Signal moderne — réactif dans toute l'app
  private _token = signal<string | null>(this.getToken());
  isLoggedIn = computed(() => {
    const token = this._token();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch { return false; }
  });

  username = signal<string | null>(localStorage.getItem(this.USER_KEY));

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string; username: string }>(
      `${this.apiUrl}/login`, credentials
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, res.username);
        this._token.set(res.token);         // ✅ signal mis à jour
        this.username.set(res.username);    // ✅ navbar réactive
      })
    );
  }

  register(credentials: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this.username.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}