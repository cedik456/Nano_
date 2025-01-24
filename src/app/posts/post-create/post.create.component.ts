import { Component } from '@angular/core';

@Component({
  selector: 'post-create',
  templateUrl: './post.create.component.html',
  styleUrls: ['./post.create.component.css'],
})
export class PostCreateComponent {
  newPost = 'This is the initial post';
  PostInput = '';

  onAddPost() {
    this.newPost = this.PostInput;
  }
}
