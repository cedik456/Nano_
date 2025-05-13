import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  email: string | null = null;
  password: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.email = this.userService.getEmail();
    this.password = this.userService.getPassword();
    console.log('Email:', this.email); // Debug log
    console.log('Password:', this.password);
  }
}
