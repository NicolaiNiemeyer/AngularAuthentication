import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.hide = "text" : this.hide = "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      // Send the object to database
      this.auth.login(this.loginForm.value).subscribe({
        next: (res => {
          console.log(res.message);
          this.loginForm.reset();
          this.auth.setToken(res.token);
          this.toast.success({ detail: "Success", summary: res.message, duration: 4000 });
          this.router.navigate(['dashboard']);
        }),
        error: (err) => {
          this.toast.error({ detail: "Error", summary: "Something went wrong", duration: 4000 });
          console.log(err);
        }
      })
    } else {
      console.log("Form is not valid");
      // Throw error using toaster and with required fields
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid")
    }
  }

}
