import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit{
  // username: string = '';
  // email: string = '';
   usernameExists:boolean = true; // Giả sử tên người dùng tồn tại trong cơ sở dữ liệu
   phoneExists:boolean = true; 
  newPassword: string = '';
  showPasswordResetForm: boolean = false;
  showcheckForm: boolean = true;
  errorMessage: string = '';
  resetPasswordMessage: string = '';
  ForgotPassForm: any = this.fb.group({
    username: [''],
    phonenumber: [''],

  });
  constructor(private authService:AuthService, private fb:FormBuilder){}
ngOnInit(): void {
  
}

  checkUser() {
    // Gửi yêu cầu đến backend để kiểm tra tên người dùng và email
    // Nếu tên người dùng và email đúng, hiển thị form đặt lại mật khẩu
    // Nếu không, hiển thị thông báo lỗi
    // Ví dụ: this.authService.checkUser(this.username, this.email).subscribe(response => { ... });
    // Trong ví dụ này, giả sử AuthService có một phương thức checkUser() trả về Observable<Response>.
    this.authService.checkUser(this.ForgotPassForm.value.username,this.ForgotPassForm.value.phonenumber).subscribe((response: any) => {
      var code = response.status;
      if (code==200)
      {
        this.usernameExists = true;
      this.phoneExists = true;
      }
      
    },() => {
      this.usernameExists = false;
      this.phoneExists = false;
    });
   

    if (this.usernameExists && this.phoneExists) {
      this.showcheckForm=false;
      this.showPasswordResetForm = true;
      this.errorMessage = '';
    } else {
      this.showcheckForm=true;
      this.showPasswordResetForm = false;
      this.errorMessage = 'Không tìm thấy tên người dùng hoặc email.';
    }
  }

  resetPassword() {
    // Gửi yêu cầu đặt lại mật khẩu đến backend với tên người dùng, email và mật khẩu mới
    // Xử lý phản hồi từ backend và hiển thị thông báo cho người dùng
    // Ví dụ: this.authService.resetPassword(this.username, this.email, this.newPassword).subscribe(response => { ... });
    // Trong ví dụ này, giả sử AuthService có một phương thức resetPassword() trả về Observable<Response>.
    this.resetPasswordMessage = 'Mật khẩu đã được đặt lại thành công.';
  }
}
