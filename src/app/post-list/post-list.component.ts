import { Component, Input } from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  @Input() posts = [{ title: '1st title', content: '1st Content' }];
}
