import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class logincomponent {
  onLogin(form: NgForm) {
    console.log(form.value);
  }
}
