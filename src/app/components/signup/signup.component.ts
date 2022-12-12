import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  hide: string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.hide = "text" : this.hide = "password";
  }
  onSignUp() {
    if (this.signUpForm.valid) {
      // Perform logic for signup
      this.auth.signUp(this.signUpForm.value).subscribe({
        next: (res => {
          this.toast.success({ detail: "Success", summary: res.message, duration: 4000 });
          this.signUpForm.reset();
          this.router.navigate(['login']);    //if sign up is a success, navigate to the login page
        }),
        error: (err => {
          this.toast.error({ detail: "Error", summary: "Something went wrong", duration: 4000 });
          console.log(err)
        })
      })
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm)
      // Logic for throwing error
    }
  }

}

