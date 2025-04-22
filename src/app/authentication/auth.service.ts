import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private isAuthenticated = false;

  private authStatusListener = new Subject<boolean>();

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  CreateUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.router.navigate(['/']);
        }
        console.log('Token received:', this.token);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
