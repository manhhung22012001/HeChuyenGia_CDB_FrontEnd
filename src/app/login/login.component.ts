import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string | undefined;
  errorMessage = 'Đăng nhập thất bại';
  successMessage: string | undefined;
  invalidLogin = false;
  loginSuccess = false;
  userRole: number;
 
  loginForm: any = this.fb.group({
    username: [''],
    password: [''],

  });
  registerForm = this.fb.group({
    
    fullname: [null, Validators.required],
    email:[null, Validators.required],
    phonenumber: [null, Validators.required],
    username: [null, Validators.required],
    password: [null, Validators.required],
    role: [null, Validators.required]
  });
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.userRole = 1;
    
  }

  ngOnInit(): void {
  }

  onSignInClick() {
    const container = document.querySelector('.container');
    if (container) {
      container.classList.add('active');
    }
  }

  onSignUpClick() {
    const container = document.querySelector('.container');
    if (container) {
      container.classList.remove('active');
    }
  }

  login() {

    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((response: any) => {
      var code = response.status;


      // Lưu token vào local storage hoặc cookie
      this.authService.setToken(response.body.token);
      console.log("status code:" + this.authService.status);
      if (code == 200) {
        this.invalidLogin = false;
        this.loginSuccess = true;
        this.successMessage = 'Đăng nhập thành công';
        this.authService.username = this.loginForm.value.username;
        this.authService.password = this.loginForm.value.password;

        this.authService.registerSuccessfulLogin(this.loginForm.value.username);



        this.onLoginSuccess(this.authService.userRole);
        console.log('userRole:', this.authService.userRole)
        console.log('id:', this.authService.id_user)
      }else if (code === 401)
      {
        this.message = "Vui lòng nhập đầy đủ thông tin.";
      }
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });

  }
  onLoginSuccess(role: number) {
    this.userRole = role;

    if (this.userRole == 1 && this.authService.status==1) {
      this.router.navigate(['/taskbar-cg'])
    }
    else if(this.userRole == 1 && this.authService.status==0){
      this.router.navigate(['/taskbar-cg0'])
    }
    else if (this.userRole == 2) {
      this.router.navigate(['/taskbar-ks'])
    }
    else {
      this.router.navigate(['/taskbar-qtv'])
    }
  }
  register() {
    
    const fullname = this.registerForm.value.fullname;
    const email=this.registerForm.value.email;
    const phonenumber = this.registerForm.value.phonenumber;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const role = this.registerForm.value.role;

    if (fullname && email && phonenumber && username && password && role) {
      console.log(fullname, email, phonenumber, username, password, role);

      this.authService.register(fullname,email, phonenumber, username ,password, role).subscribe(response => {
        var code = response.status;
        if (code === 201) {
          this.message = "Đăng ký thành công";
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.message = "Tên đăng nhập đã tồn tại.";
          } 
          else {
            this.message = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
          }
        }
      );
    } else {
      this.message = "Vui lòng nhập đầy đủ thông tin.";
    }
  }
}
