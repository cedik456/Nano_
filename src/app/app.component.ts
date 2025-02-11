import { Component } from '@angular/core';

interface Post {
  title: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-project';
  storedPosts: Post[] = [];

  onPostAdded(post: Post): void {
    this.storedPosts.push(post);
  }
}
