import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private isAuthenticated = false;
  private tokenTimer: any;
  userId: string | null = null;
  private email: string | null = null;

  private authStatusListener = new Subject<boolean>();

  getEmail() {
    return this.email; // Add a getter for the email
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  CreateUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        email: string;
      }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(
            token,
            expirationDate,
            response.userId,
            response.email
          );
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.email = response.email;

          this.authStatusListener.next(true);
          // Pass the email to the UserService
          this.userService.setUserData(email, password);
          this.userService.setUserData(email, password);

          console.log('Login successful:', email, password);
          this.router.navigate(['/']);

          console.log('Token received:', this.token);
          console.log('Token expires at:', expirationDate);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.email = null;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    const expiresInDuration =
      authInformation.expirationDate.getTime() - now.getTime();

    if (expiresInDuration > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.email = authInformation.email;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresInDuration / 1000);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');

    if (!token || !expirationDate || !userId || !email) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      email: email,
    };
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    email: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
