import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { FormGroup } from '@angular/forms';
import { mimetype } from './mime-type.validator';

@Component({
  selector: 'post-create',
  templateUrl: './post.create.component.html',
  styleUrls: ['./post.create.component.css'],
})
export class PostCreateComponent implements OnInit {
  // enteredTitle = '';
  // enteredContent = '';
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  private mode = 'create';
  private postId: any | null = null;
  public post: Post | null = null;
  public Loading = false;
  form: FormGroup = new FormGroup({});
  Pickedimage?: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimetype],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.Loading = true;
        if (this.postId) {
          this.postsService.getPost(this.postId).subscribe((postData) => {
            this.Loading = false;
            this.post = {
              id: postData._id,
              title: postData.title || '',
              content: postData.content || '',
              imagePath: undefined,
            };
            this.form.setValue({
              title: this.post?.title || '',
              content: this.post?.content || '',
            });
          });
        }
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  PickedImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.Pickedimage = reader.result as string; // Set the image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      console.error('No file selected');
    }
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId!,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
