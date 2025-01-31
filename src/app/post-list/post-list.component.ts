import { Component } from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  posts = [
    { title: '1st Title', content: 'Surprise my g' },
    { title: '2nd Title', content: 'Hello Bossing' },
    { title: '3rd Title', content: 'Heeeeeeeshhh' },
  ];
}
