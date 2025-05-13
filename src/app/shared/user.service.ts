import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private email: string | null = null;
  private password: string | null = null;

  setUserData(email: string, password: string): void {
    console.log('Setting user data:', email, password);
    this.email = email;
    this.password = password;

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
  }

  getEmail(): string | null {
    if (!this.email) {
      this.email = localStorage.getItem('email');
    }
    return this.email;
  }
  getPassword(): string | null {
    if (!this.password) {
      this.password = localStorage.getItem('password');
    }
    return this.password;
  }

  clearUserData(): void {
    this.email = null;
    this.password = null;

    localStorage.removeItem('email');
    localStorage.removeItem('password');
  }
}
