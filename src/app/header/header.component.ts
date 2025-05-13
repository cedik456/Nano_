import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs!: Subscription;
  public userIsAuthenticated = false;
  email: string | null = null;
  constructor(
    private authService: AuthService,
    private searchService: SearchService
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
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onSearch(term: string) {
    this.searchService.setSearchTerm(term); // Emit the search term
  }
}
