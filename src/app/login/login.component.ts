import { Component,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = 'Đăng nhập thất bại';
  successMessage: string | undefined;
  invalidLogin = false;
  loginSuccess = false;
  userRole: number;
  loginForm: any = this.fb.group({
      username: [''],
      password: [''],
      
  });
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { 
    this.userRole=1;
  }
  
  ngOnInit(): void {
  }

  login() {
    
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((response: any) => {
      var code = response.status;
      console.log("status code:" + code);
      if (code == 200) {
        this.invalidLogin = false;
        this.loginSuccess = true;
        this.successMessage = 'Đăng nhập thành công';
        this.authService.username = this.loginForm.value.username;
        this.authService.password = this.loginForm.value.password;
       
        this.authService.registerSuccessfulLogin(this.loginForm.value.username);
       
        
        // Lấy và lưu fullname vào localStorage (nếu `fullname` là key chứa thông tin fullname trong response.body)
        if (response.body.hasOwnProperty('fullname')) {
          localStorage.setItem('fullname', response.body['fullname']);
          console.log('Full Name:', localStorage.getItem('fullname'));
        }
        if (response.body.hasOwnProperty('id_user')) {
          localStorage.setItem('id_user', response.body['id_user']);
          console.log('id_user:', localStorage.getItem('id_user'));
        }
        
       
        
        localStorage.setItem('user', JSON.stringify(response.body)); // lấy toàn bộ thông tin user         
        //this.router.navigate(['/index']);
        if (response.body.hasOwnProperty('role')) {
          this.onLoginSuccess(response.body.role);
        }
       
      }
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });
   
  }
  onLoginSuccess(role: number) {
    this.userRole = role;
    if (this.userRole==1)
    {
      this.router.navigate(['/taskbar-cg'])
    }
    else if (this.userRole==2)
    {
      this.router.navigate(['/taskbar-ks'])
    }
    else 
    {
      this.router.navigate(['/taskbar-qtv'])
    }
}
}
