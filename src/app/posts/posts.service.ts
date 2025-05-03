import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service'; // adjust path if needed

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getPosts(
    pagesize: number,
    currentpage: number
  ): Observable<{ posts: Post[]; postCount: number }> {
    const queryParams = `?pagesize=${pagesize}&currentpage=${currentpage}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            postCount: postData.maxPosts,
          };
        })
      );
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    postData.append('creator', this.authService.getUserId() || '');

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe({
        next: (responseData) => {
          const newPost: Post = {
            id: responseData.post.id,
            title: title,
            content: content,
            imagePath: responseData.post.imagePath,
            creator: this.authService.getUserId() || '',
          };
          this.posts.push(newPost);
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: this.posts.length,
          });
          this.router.navigate(['/']); // Navigate back to the main page
        },
        error: (error) => {
          console.error('Failed to add post:', error);
        },
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    const creator = this.authService.getUserId() || '';

    if (typeof image === 'object') {
      // If the image is a File, create a FormData object
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image); // Add the new image file
    } else {
      // If the image is a string (existing imagePath), use a Post object
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image, // Keep the existing imagePath
        creator: creator,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
