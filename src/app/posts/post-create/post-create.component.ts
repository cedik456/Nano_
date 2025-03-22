import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from "../post.model"

@Component({
  selector: 'post-create',
  templateUrl: './post.create.component.html',
  styleUrls: ['./post.create.component.css'],
})
export class PostCreateComponent implements OnInit {
  // enteredTitle = '';
  // enteredContent = '';
  constructor(public postsService: PostsService, public route:ActivatedRoute) {}
  
  private mode= 'create';  
  private postId: any | null = null;
  public post: Post | null = null; 


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode='edit';
        this.postId= paramMap.get('postId')!;

        if (this.postId) {
          this.postsService.getPost(this.postId).subscribe(postData => {  
              this.post = {
                id: postData._id, 
                  title: postData.title || '',
                  content: postData.content || '' 
              };
          });
      }
       
      } else {
        this.mode='create';
        this.postId = null;
      }
    });
  }

  onAddPost( form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    if(this.mode==="create"){  
      this.postsService.addPost(form.value.title, form.value.content );  
    }else{  
      this.postsService.updatePost(  
        this.postId,  
        form.value.title,  
        form.value.content  
      );  
    }  
    form.resetForm();  
  }  
}
