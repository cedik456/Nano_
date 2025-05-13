import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';
import { SearchService } from '../shared/search.service';
import { UserService } from '../shared/user.service'; // Import UserService

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs!: Subscription;
  public userIsAuthenticated = false;
  email: string | null = null;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.email = this.authService.getEmail();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.email = this.authService.getEmail();
      });

    const darkModeState = localStorage.getItem('isDarkMode');
    this.isDarkMode = darkModeState === 'true';
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onSearch(term: string) {
    this.searchService.setSearchTerm(term);
  }

  onEmailClick() {
    this.userService.setUserData(this.email || '', '');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
  }
}
