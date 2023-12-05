
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private key = environment.securitykey;
  message: string | undefined;
  errorMessage = 'Đăng nhập thất bại';
  successMessage: string | undefined;
  invalidLogin = false;
  loginSuccess = false;
  status : string = '0';
  userRole: number;

  loginForm: any = this.fb.group({
    username: [''],
    password: [''],

  });
  registerForm = this.fb.group({

    fullname: [null, Validators.required],
    email: [null, Validators.required],
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
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    // Mã hóa mật khẩu
    const encryptedText = this.encryptText(this.loginForm.value.password,this.key);
   
    this.authService.login(this.loginForm.value.username, encryptedText).subscribe((response: any) => {
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
      } else if (code === 401) {
        this.message = "Vui lòng nhập đầy đủ thông tin.";
      }
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });

  }
  // Hàm mã hóa AES
// Hàm để mã hóa văn bản sử dụng AES với EBC và PKCS7 padding
encryptText(text: string, key: string): string {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  

  const encrypted = CryptoJS.AES.encrypt(text, keyUtf8, {
   
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

  onLoginSuccess(role: number) {
    this.userRole = role;
    console.log(" a: " + this.authService.id_user);
    if (this.userRole == 1 && this.authService.status == 1) {
      this.router.navigate(['/taskbar-cg'])
    }
    else if (this.userRole == 1 && this.authService.status == 0) {
      this.router.navigate(['/taskbar-cg0'])
    }
    else if (this.userRole == 1 && this.authService.status == 'null') {
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
    const email = this.registerForm.value.email;
    const phonenumber = this.registerForm.value.phonenumber;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const role = this.registerForm.value.role;
    
    if (fullname && email && phonenumber && username && password && role) {
      // Mã hóa mật khẩu trước khi gửi đến backend
      const hashedPassword = this.hashPassword(password);
      //console.log("mk: " + hashedPassword)
      this.authService.register(fullname, email, phonenumber, username, hashedPassword, role).subscribe(response => {
        var code = response.status;
        if (code === 201) {
          this.message = "Đăng ký thành công";
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.message = "Email hoặc Số điện thoại đăng ký đã tồn tại.";
          } else {
            this.message = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
          }
        }
      );
    } else {
      this.message = "Vui lòng nhập đầy đủ thông tin.";
    }
  }

  hashPassword(password: string): string {
    // Thực hiện mã hóa mật khẩu ở phía frontend (Ví dụ: sử dụng bcryptjs)
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

}