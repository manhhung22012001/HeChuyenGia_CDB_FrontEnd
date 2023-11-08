import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit{
  username: string = '';
  email: string = '';
  usernameExists:boolean = true; // Giả sử tên người dùng tồn tại trong cơ sở dữ liệu
  phoneExists:boolean = true; 
  phonenumber: string = '';
  newPassword: string = '';
  showPasswordResetForm: boolean = false;
  showcheckForm: boolean = true;
  showcheckOTP: boolean = false;
  errorMessage: string = '';
  resetPasswordMessage: string = '';
  ForgotPassForm: any = this.fb.group({
    username: [''],
    phonenumber: [''],
    email: [''],

  });
ngOnInit(): void {
  
}
constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
  
}

checkUserInfo() {
  
  if (this.ForgotPassForm.valid) {
    // Gọi phương thức của service để gửi yêu cầu POST
    this.authService.checkUserInfo(this.ForgotPassForm.value.username, this.ForgotPassForm.value.phonenumber,this.ForgotPassForm.value.email)
      .subscribe(
        (response: any) => {
          console.log(response.username);
          if (this.ForgotPassForm.value.username==response.username) {
            // Người dùng tồn tại trong hệ thống
            console.log("ok");
            this.errorMessage = "Xác thực thành công. Check Email để lấy OTP";
           
             this.showcheckForm =  false;  // Thiết lập showcheckForm thành false
             this.showPasswordResetForm = false;  // Thiết lập showPasswordResetForm thành true
            this.showcheckOTP=true
          } 
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            // Lỗi khi người dùng không nhập đầy đủ thông tin
            this.errorMessage = "Người dùng không tồn tại.";
          } else {
            // Lỗi không xác định
            this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
          }
        }
      );
  } else {
    // Người dùng chưa nhập đầy đủ thông tin
    this.errorMessage = "Vui lòng nhập đầy đủ thông tin.";
  }
  
}
checkOTP(){
  this.authService.checkotp(this.ForgotPassForm.value.otpcode).subscribe(
    (response:any) => {
      if(this.ForgotPassForm.value.otpcode==response.otpcode)
      {
          this.showPasswordResetForm=true;
          this.showcheckForm=false;
          this.showcheckOTP=false;
      }
    },
    (error: HttpErrorResponse) => {
      if (error.status === 404) {
        // Lỗi khi người dùng không nhập đầy đủ thông tin
        this.errorMessage = "Mã OTP không chính xác .";
      } else {
        // Lỗi không xác định
        this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      }
    }

  )
}

    // Gửi yêu cầu đến backend để kiểm tra tên người dùng và email
    // Nếu tên người dùng và email đúng, hiển thị form đặt lại mật khẩu
    // Nếu không, hiển thị thông báo lỗi
    // Ví dụ: this.authService.checkUser(this.username, this.email).subscribe(response => { ... });
    // Trong ví dụ này, giả sử AuthService có một phương thức checkUser() trả về Observable<Response>.
    // const usernameExists = true; // Giả sử tên người dùng tồn tại trong cơ sở dữ liệu
    // const emailExists = true; // Giả sử email tồn tại trong cơ sở dữ liệu

    // if (usernameExists && emailExists) {
    //   this.showcheckForm=false;
    //   this.showPasswordResetForm = true;
    //   this.errorMessage = '';
    // } else {
    //   this.showcheckForm=true;
    //   this.showPasswordResetForm = false;
    //   this.errorMessage = 'Không tìm thấy tên người dùng hoặc email.';
    // }
  

  resetPassword() {
    // Gửi yêu cầu đặt lại mật khẩu đến backend với tên người dùng, email và mật khẩu mới
    // Xử lý phản hồi từ backend và hiển thị thông báo cho người dùng
    // Ví dụ: this.authService.resetPassword(this.username, this.email, this.newPassword).subscribe(response => { ... });
    // Trong ví dụ này, giả sử AuthService có một phương thức resetPassword() trả về Observable<Response>.
    this.resetPasswordMessage = 'Mật khẩu đã được đặt lại thành công.';
  }
}
