import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../data.service';


@Component({
  selector: 'app-taskbar-cg',
  templateUrl: './taskbar-cg.component.html',
  styleUrls: ['./taskbar-cg.component.css']
})
export class TaskbarCgComponent implements OnInit {
  id: any;
  benhs: any[] = [];
  listTrieuChung: any[] = [];
  fullname: any;
  selectedBenh: any; // Khai báo biến selectedBenh để lưu trữ bệnh được chọn
  hoveredBenh: any;
  loai_he: String = '';
  isAddingNewBenh: boolean = false;
  newBenh: any = {
    ten_benh: '',
    trieu_chung: [''] // Mảng triệu chứng, bắt đầu với một textbox
  };
  
  constructor(private router: Router, private authService: AuthService, private dataService: DataService) {
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');


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
  addbenh(){

  }
  addNewBenh() {
    this.isAddingNewBenh = true;
  }
  addNewTrieuChungIfLast(index: number) {
    if (index === this.newBenh.trieu_chung.length - 1) {
      this.addNewTrieuChung();
    }
  }
  addNewTrieuChung() {
    this.newBenh.trieu_chung.push('');
  }
  saveNewBenh() {
    // Xử lý lưu thông tin bệnh, có thể gọi API hoặc thực hiện các thao tác khác ở đây
    console.log('Saved new benh:', this.newBenh);
    // Sau khi lưu, reset trạng thái
    this.isAddingNewBenh = false;
    this.newBenh = {
      ten_benh: '',
      trieu_chung: ['']
    };
  }
  onTrieuChungBlur(index: number) {
    const element = document.getElementById(`trieuChung${index}`);
    if (element) {
      if (index === this.newBenh.trieu_chung.length - 1) {
        // Đảm bảo rằng đối tượng DOM tồn tại trước khi gọi focus()
        element.focus();
      }
    }
  }
  
      
}
