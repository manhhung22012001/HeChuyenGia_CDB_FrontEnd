import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-taskbar-cg0',
  templateUrl: './taskbar-cg0.component.html',
  styleUrls: ['./taskbar-cg0.component.css']
})
export class TaskbarCg0Component implements OnInit {
  fullname: any;
  id: any;
  phonenumber: any;
  email: any;
  user: any = {};
  userDetail: any = {};
  showUpdateView: boolean = false;
  userInformation: any;

  // Thêm các biến mới cho các đường dẫn ảnh
  bangTotNghiepYKhoaImage: File | null = null;
  chungChiHanhNgheImage: File | null = null;
  chungNhanChuyenKhoaImage: File | null = null;
  Image: File | null = null;
  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private fb: FormBuilder) {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    this.id = localStorage.getItem('id_user');
    this.fullname=localStorage.getItem('fullname');





  }
  ngOnInit() {

  }
  updateUserInfo1() {
    console.log(this.id);
    this.dataService.getUserInfo(this.id).subscribe(
      (userInfo: any) => {
        console.log(userInfo);
        if (userInfo) {
          // Show the update view
          this.showUpdateView = true;

          this.userInformation = userInfo;

        } else {
          // Handle the case where user information is not available
          console.error('User information not found.');
        }
      },
      (error: any) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );

  }
  updateUserInfo(user: any) {
    // Gọi service để cập nhật thông tin người dùng
    // Các bước cập nhật sẽ được thực hiện ở đây
    // Sau khi cập nhật thành công, có thể thông báo hoặc thực hiện các hành động khác
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];

    // Kiểm tra định dạng và kích thước của file
    if (!this.isValidFile(file)) {
      // Nếu không đúng, xóa giá trị file và thông báo cho người dùng
      event.target.value = null;
      alert('Vui lòng chọn file định dạng .png, .jpg, hoặc .pdf và có dung lượng dưới 2MB.');
      return;
    }

    // Lưu file vào biến tương ứng
    switch (field) {
      case 'bangTotNghiepYKhoa':
        this.bangTotNghiepYKhoaImage = file;
        break;
      case 'chungChiHanhNghe':
        this.chungChiHanhNgheImage = file;
        break;
      case 'chungNhanChuyenKhoa':
        this.chungNhanChuyenKhoaImage = file;
        break;
      case 'anhdaidien':
        this.Image = file;
        break;
      default:
        break;
    }
  }

  // Kiểm tra định dạng và kích thước của file
  isValidFile(file: File): boolean {
    const allowedFormats = ['.png', '.jpg', '.pdf'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    return (
      file &&
      allowedFormats.some(format => file.name.toLowerCase().endsWith(format)) &&
      file.size <= maxSize
    );
  }

  // Hàm để thực hiện tải ảnh lên server
  uploadImages() {
    // Bạn có thể sử dụng các biến (this.bangTotNghiepYKhoaImage, this.chungChiHanhNgheImage, this.chungNhanChuyenKhoaImage)
    // để thực hiện quá trình tải lên ảnh và cập nhật dữ liệu trên server tùy ý.
    // Hãy gọi các hàm xử lý tải ảnh và cập nhật dữ liệu từ đây.
  }
}
