import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-taskbar-qtv',
  templateUrl: './taskbar-qtv.component.html',
  styleUrls: ['./taskbar-qtv.component.css']
})
export class TaskbarQtvComponent implements OnInit {
  id: any;
  users: any[] = [];
  ShowTable: boolean = true;
  ShowFrom: boolean = false;
  showStatusDropdown: boolean = false;
  fullname: any;
  message: string = '';
  isEditing: boolean = false;
  loggedInUserId = this.authService.id_user;
  newUser: any = {
    fullname: '',
    phonenumber: '',
    email: '',
    username: '',
    password: '',
    role: '',
    status: ''
  };
  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private dialog: MatDialog) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
  }

  ngOnInit(): void {

    this.dataService.getUsers().subscribe(
      data => {
        this.users = data;

      },
      error => {
        console.error('Error loading users data: ', error);
      }
    );
  }
  getRoleName(role: string): string {
    switch (role) {
      case '1':
        return 'Bác sĩ';
      case '2':
        return 'Kỹ sư';
      case '3':
        return 'Quản trị viên';
      default:
        return '';
    }
  }


  // Hàm để thêm bác sĩ mới
  addNewUser() {
    // Hiển thị modal hoặc form để nhập thông tin bác sĩ mới

    // Sau khi người dùng nhập thông tin và nhấn "Lưu"
    // Thêm bác sĩ mới vào mảng users
    const fullname = this.newUser.fullname;
    const email = this.newUser.email;
    const phonenumber = this.newUser.phonenumber;
    const username = this.newUser.username;
    const password = this.newUser.password;
    const role = this.newUser.role;
    var status;
    if (role == 1) {
      status = this.newUser.status;
    }
    else {
      status = ' ';
    }

    if (fullname && email && phonenumber && username && password && role && status) {
      console.log(fullname, email, phonenumber, username, password, role, status);

      this.authService.qtvregister(fullname, email, phonenumber, username, password, role, status).subscribe(response => {
        var code = response.status;
        if (code === 201) {
          this.message = "Đăng ký thành công";
          this.ngOnInit()
          this.ShowFrom = false;
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.message = "Email hoặc Số điện thoại đăng ký đã tồn tại.";
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

  onRoleChange1() {
    if (this.newUser.role === '1') {
      this.showStatusDropdown = true;
    } else {
      this.showStatusDropdown = false;
      this.newUser.status = ''; // Đặt giá trị trạng thái về rỗng khi không cho chọn
    }
  }

  LoadForm() {
    // Hiển thị modal hoặc form để nhập thông tin bác sĩ mới
    this.ShowFrom = true;

  }
  logout() {
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id = key;
    this.router.navigate(['/' + this.id]);
  }
  onFullnameChange(event: any, user: any) {
    user.fullname = event.target.innerText;
  }
  onActiveChange(event: any, user: any) {
    user.status = event.target.innerText;
  }
  onStatusChange(user: any) {
    if (this.isEditing) {
      // Bạn có thể thêm xử lý khác nếu cần thiết trước khi gọi hàm updateUser
      this.updateUser(user);
    }
  }

  onEmailChange(event: any, user: any) {
    user.email = event.target.innerText;
  }


  // onRoleChange(event: any, user: any) {
  //   user.role = event.target.innerText;
  // }

  onPhoneNumberChange(event: any, user: any) {
    user.phonenumber = event.target.innerText;
  }

  deleteUser(users: any) {

    if (users.id_user == this.authService.id_user) {
      console.log(users.id_user);
      alert('Bạn không thể xóa tài khoản của chính mình.');
    }
    else {
      const dialogRef = this.dialog.open(ConfirmComponent, {

        data: {
          title: 'Xác nhận xóa người dùng',
          message: 'Bạn có chắc chắn muốn xóa người dùng này không?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Nếu người dùng chọn "Có", thực hiện xóa người dùng
          const userId = users.id_user;
          this.dataService.deleteUser(userId).subscribe(
            () => {
              // Xóa người dùng khỏi danh sách hiển thị
              this.users = this.users.filter(u => u.id_user !== userId);
            },
            error => {
              console.error('Error deleting user: ', error);
            }
          );
        }
      });
    }
  }
  updateUser(user: any) {
    // Lấy ID người dùng cần cập nhật
    const userId = user.id_user;

    // Lấy thông tin người dùng từ form chỉnh sửa hoặc các trường khác trong user object
    const updatedUser: any = {
      id_user: userId, // Bạn cần chắc chắn rằng id_user được gán lại đúng giá trị
      fullname: user.fullname, // Lấy từ form hoặc các trường thông tin khác
      role: user.role,
      phonenumber: user.phonenumber,
      status: user.status,
      email :user.email
      // Thêm các trường thông tin khác nếu cần
    };

    // Gọi hàm updateUser() trong dataService để gửi yêu cầu cập nhật
    this.dataService.updateUser(userId, updatedUser).subscribe(
      (response: any) => {
        this.message = "Cập Nhật Thông Tin Thành Công.";
        this.isEditing = true;
        // Cập nhật thông tin người dùng trong danh sách hiển thị (nếu cần)
        const index = this.users.findIndex(u => u.id_user === response.id_user);
        if (index !== -1) {
          this.users[index] = response;
        }
      },
      error => {
        this.message = "Cập Nhật Thông Tin Thất Bại.";
        this.isEditing = true;
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    );
  }
  startEditing(user: any) {
    this.isEditing = false;
    // Các hành động khác cần thiết khi bắt đầu chỉnh sửa, nếu có
  }



}

