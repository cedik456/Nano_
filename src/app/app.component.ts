import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';

interface Post {
  title: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // title = 'angular-project';
  // storedPosts: Post[] = [];
  // onPostAdded(post: Post): void {
  //   this.storedPosts.push(post);
  // }

  constructor(private authservice: AuthService) {}
  ngOnInit() {
    this.authservice.autoAuthUser();
  }
}
