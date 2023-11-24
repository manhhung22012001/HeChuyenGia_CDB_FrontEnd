import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder,FormControl,FormArray } from '@angular/forms';
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
  pheDuyetBenh: boolean=false;
  pheDuyetUser :boolean=false;
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
  userForms!: FormGroup;
  updateMessages: string[] = [];
  PheduyetBenh:boolean=false;
  benhs: any[] = [];
  listTrieuChung: any[] = [];
  selectedBenh: any; 
  hoveredBenh: any;
  trieuchung:any[]=[];


  constructor(private formBuilder: FormBuilder,private router: Router, private authService: AuthService, private dataService: DataService, private dialog: MatDialog) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
  }
  ngOnInit() {
    
  }
  pheduyetUser(){
    this.pheDuyetBenh =false;
    this.pheDuyetUser =true;
    // Initialize your form group
    this.userForms = this.formBuilder.group({
      users: this.formBuilder.array([]) // Or initialize with default values
    });

    // Load data into the form (Assuming this.dataService.getUsers() returns the data)
    this.dataService.getUsers().subscribe((data: any[]) => {
      data.forEach((user,index) => {
        this.addUserForm(user);
       this.checkupdate(user.id_user,index)
      });
    });
  }
  addUserForm(user: any) {
    const userForm = this.formBuilder.group({
      id_user: new FormControl(user.id_user),
      fullname: new FormControl(user.fullname),
      role: new FormControl(user.role),
      phonenumber: new FormControl(user.phonenumber),
      email: new FormControl(user.email),
      status: new FormControl(user.status)
      // Add other fields as needed
    });

    // Access the 'users' form array and push the new user form group
    this.usersFormArray.push(userForm);
  }

  get usersFormArray() {
    return this.userForms.get('users') as FormArray;
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
    user.fullname = event.target.value;
  }
  onActiveChange(event: any, user: any) {
    user.status = event.target.value;
  }
  onStatusChange(index:number,user: any) {
    if (this.isEditing) {
      // Bạn có thể thêm xử lý khác nếu cần thiết trước khi gọi hàm updateUser
      this.updateUser(index,user);
    }
  }

  onEmailChange(event: any, user: any) {
    user.email = event.target.value;
  }


  // onRoleChange(event: any, user: any) {
  //   user.role = event.target.innerText;
  // }

  onPhoneNumberChange(event: any, user: any) {
    user.phonenumber = event.target.value;
  }

  deleteUser(user: any) {
    console.log(user.value.id_user);
    console.log(this.authService.id_user)
    console.log(this.authService.getID())
    if (user.value.id_user == this.authService.getID()) {
      
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
          const userId = user.value.id_user;
          this.dataService.deleteUser(userId).subscribe(
            () => {
              // Xóa người dùng khỏi danh sách hiển thị
              this.users = this.users.filter(u => u.value.id_user !== userId);
              this.ngOnInit();
            },
            error => {
              console.error('Error deleting user: ', error);
            }
          );
        }
      });
    }
  }
  updateUser(index: number,user: any) {
    // Lấy ID người dùng cần cập nhật
    const userId = user.value.id_user;
    console.log(userId);

    // Lấy thông tin người dùng từ form chỉnh sửa hoặc các trường khác trong user object
    const updatedUser = {
      id_user: userId,
      fullname: user.get('fullname')?.value,
      role: user.get('role')?.value,
      phonenumber: user.get('phonenumber')?.value,
      status: user.get('status')?.value,
      email: user.get('email')?.value
      // Thêm các trường thông tin khác nếu cần
    };
    console.log(updatedUser);

    // Gọi hàm updateUser() trong dataService để gửi yêu cầu cập nhật
    this.dataService.updateUser(userId,  updatedUser).subscribe(
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

  // your-component.ts
CheckIn4(id_user: any) {
  this.dataService.getUserInfo(id_user).subscribe(
    (data) => {
      console.log('User Details:', data);

      // Lưu trữ dữ liệu trong DataService
      this.dataService.setUserDetails(data);

      // Chuyển sang component khác
      this.router.navigate(['/qtv-cgmanage']);
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

checkupdate(id_user: any, index: number) {
  this.dataService.getUserInfo(id_user).subscribe(
    (data) => {
      if (data.role == '1' && data.status=='0') {
        if (data.bangTotNghiepYKhoa == null) {
          this.updateMessages[index] = 'Chưa cập nhật thông tin';
        } else {
          this.updateMessages[index] = 'Đã cập nhật thông tin';
        }
      } else {
        this.updateMessages[index] = '';
      }
    }
  )
}
pheduyetBenh(){
  this.pheDuyetBenh =true;
    this.pheDuyetUser =false;
this.PheduyetBenh=true;
this.dataService.getnewbenh().subscribe(
  response  => {
    console.log(response);
    this.benhs = response;
  },
  error => {
    console.error('Error loading users data: ', error);
  }
)
this.dataService.gettrieuchungcu().subscribe(
  response =>{
    console.log(response);
    this.trieuchung=response;
  },
  error => {
    console.error('Error loading users data: ', error);
  }
)

}
selectBenh(benh: any) {
  this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn
  console.log(benh)
  // Chuyển đổi giá trị ma_benh thành số nguyên
  const maBenh = parseInt(benh.ma_benh_moi, 10);
  // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn
  this.dataService.getTrieuChungByMaBenhMoi(benh.ma_benh_moi,this.authService.getID()).subscribe(
    (trieuChung: any[]) => {
      // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
      console.log(trieuChung);
      // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
      this.listTrieuChung = trieuChung;
    },
    (error) => {
      // Xử lý lỗi nếu có
      console.error('Error fetching trieu chung:', error);

    }
  );

}
// Trong file TypeScript của bạn
editSymptom(benh: any) {
  benh.isEditing = true;
}

saveEditedSymptom(benh: any) {
  // Lưu thay đổi vào cơ sở dữ liệu hoặc nơi bạn muốn
  const updatedTC={
    ma_trieu_chung_moi:benh[0],
    ten_trieu_chung_moi:benh[1],
    trang_thai:'1',
    ma_benh_moi: this.selectedBenh.ma_benh_moi
  }
  console.log(updatedTC);
  this.dataService.savenewtrieuchung(this.authService.getID(),updatedTC).subscribe(
    (response: any) => {
      console.log(response)
      this.message = "Cập Nhật Thông Tin Thành Công.";
      
    },
    error => {
      this.message = "Cập Nhật Thông Tin Thất Bại.";
      
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  );
  console.log('Đã lưu:', benh);
  benh.isEditing = false; // Kết thúc chỉnh sửa
}


}

