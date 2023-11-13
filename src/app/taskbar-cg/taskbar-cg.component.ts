import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../data.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-taskbar-cg',
  templateUrl: './taskbar-cg.component.html',
  styleUrls: ['./taskbar-cg.component.css']
})
export class TaskbarCgComponent implements OnInit {
  id: any;
  benhs: any[] = [];
  listTrieuChung: any[] = [];
  trieuChungArray: any[] = [{ trieuChung: '' }];
  fullname: any;
  selectedBenh: any; // Khai báo biến selectedBenh để lưu trữ bệnh được chọn
  hoveredBenh: any;
  loai_he: String = '';
  isAddingNewBenh: boolean = false;
  errorMessage: string = '';

  newBenh: any = {
    ten_benh: '',
    trieu_chung: [''], // Bắt đầu với một mảng rỗng// Start with an empty object
    loai_he: ''
  };

  constructor(private router: Router, private authService: AuthService, private dataService: DataService,private formBuilder: FormBuilder) {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
    this.id = localStorage.getItem('id_user');



  }
  // Trong component của bạn


  ngOnInit() {

  }

  // Hàm để chuyển đổi giữa notactiveForm và activeForm


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id = key;
    this.router.navigate(['/' + this.id]);
  }
  onCheckboxChange() {
    // Lọc danh sách bệnh theo loại hệ hô hấp là 1 nếu checkbox được chọn
    if (this.loai_he == '1') {
      this.dataService.getBenhbyhe(1).subscribe(
        data => {
          this.benhs = data;
        },
        error => {
          console.error('Error loading users data: ', error);
        }
      )
    } else if (this.loai_he == '2') {
      this.dataService.getBenhbyhe(2).subscribe(
        data => {
          this.benhs = data;
        },
        error => {
          console.error('Error loading users data: ', error);
        })
    }
    else {
      this.dataService.getBenh().subscribe(
        data => {
          this.benhs = data;
        },
        error => {
          console.error('Error loading users data: ', error);
        }
      )
    }
  }
  selectBenh(benh: any) {
    this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn
    console.log(benh)
    // Chuyển đổi giá trị ma_benh thành số nguyên
    const maBenh = parseInt(benh.ma_benh, 10);
    // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn
    this.dataService.getTrieuChungByMaBenh(benh.ma_benh).subscribe(
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

  addNewBenh() {
    this.isAddingNewBenh = true;
  }
  updateTrieuChung(value: string, index: number): void {
    this.newBenh.trieu_chung[index] = value;
  }
  
  addNewTrieuChungIfLast(index: number): void {
    if (index === this.newBenh.trieu_chung.length - 1) {
      this.addNewTrieuChung();
    }
  }
  
  addNewTrieuChung(): void {
    this.newBenh.trieu_chung.push('');
  }
  
  removeTrieuChung(index: number): void {
    this.newBenh.trieu_chung.splice(index, 1);
  }
  
  saveNewBenh() {
    console.log('Đã lưu bệnh mới:', this.newBenh);
    this.dataService.addNewBenh(this.id, this.newBenh.ten_benh, this.newBenh.loai_he, this.newBenh.trieu_chung).subscribe(
      (response: any) => {
        if (response && response.status) {
          var code = response.status;
          console.log(code);
  
          if (code === 200) {
            this.errorMessage = "Đăng ký thành công";
            console.log('Đã lưu bệnh mới:', this.newBenh);
  
            // Sau khi lưu, đặt lại trạng thái
            this.isAddingNewBenh = false;
            this.newBenh = {
              ten_benh: '',
              loai_he: '',
              trieu_chung: [''] // Điều chỉnh giá trị mặc định để khớp cấu trúc phía backend
            };
          } else {
            // Handle the case when the status code is not 200
            console.error('Unexpected status code:', code);
          }
        } else {
          // Handle the case when response or response.status is null or undefined
          console.error('Invalid response:', response);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = "Tên đăng nhập đã tồn tại.";
        } else {
          this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        }
      }
    );
  }
  

}
