import { Component,OnInit } from '@angular/core';


@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit{
  username: string = '';
  email: string = '';
  newPassword: string = '';
  showPasswordResetForm: boolean = false;
  showcheckForm: boolean = true;
  errorMessage: string = '';
  resetPasswordMessage: string = '';
ngOnInit(): void {
  
}
  checkUser() {
    // Gửi yêu cầu đến backend để kiểm tra tên người dùng và email
    // Nếu tên người dùng và email đúng, hiển thị form đặt lại mật khẩu
    // Nếu không, hiển thị thông báo lỗi
    // Ví dụ: this.authService.checkUser(this.username, this.email).subscribe(response => { ... });
    // Trong ví dụ này, giả sử AuthService có một phương thức checkUser() trả về Observable<Response>.
    const usernameExists = true; // Giả sử tên người dùng tồn tại trong cơ sở dữ liệu
    const emailExists = true; // Giả sử email tồn tại trong cơ sở dữ liệu

    if (usernameExists && emailExists) {
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
