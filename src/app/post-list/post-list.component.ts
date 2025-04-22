import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;
  private authStatusSub!: Subscription;

  public userIsAuthenticated = false;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  public totalposts = 0;
  public postperpage = 10;
  public currentpage = 1;
  public pageSizeOption = [1, 2, 5, 10];
  public Loading = false;

  ngOnInit() {
    this.Loading = true;
    this.postsService.getPosts(this.postperpage, this.currentpage).subscribe({
      next: (postData: { posts: Post[]; postCount: number }) => {
        this.Loading = false;
        this.totalposts = postData.postCount;
        this.posts = postData.posts;
      },
      error: () => {
        this.Loading = false; // Reset Loading if an error occurs
      },
    });

    // Subscribe to postsUpdated to listen for changes
    this.postsSub = this.postsService.getPostUpdatedListener().subscribe({
      next: (postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
      },
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.Loading = true;
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage).subscribe({
      next: (postData: { posts: Post[]; postCount: number }) => {
        this.Loading = false;
        this.totalposts = postData.postCount;
        this.posts = postData.posts;
      },
      error: () => {
        this.Loading = false;
      },
    });
  }

  onDelete(postId: string) {
    this.Loading = true;
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.postsService
          .getPosts(this.postperpage, this.currentpage)
          .subscribe({
            next: (postData: { posts: Post[]; postCount: number }) => {
              this.Loading = false;
              this.totalposts = postData.postCount;
              this.posts = postData.posts;
            },
            error: () => {
              this.Loading = false;
            },
          });
      },
      error: () => {
        this.Loading = false;
      },
    });
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }
}
