import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-taskbar-ks',
  templateUrl: './taskbar-ks.component.html',
  styleUrls: ['./taskbar-ks.component.css']
})
export class TaskbarKsComponent implements OnInit {
  id: any;
  fullname: any;
  themLuat: boolean = false;
  themBenh: boolean = false;
  listTrieuChung: any[] = [];
  benhs: any[] = [];
  trieuchung: any[] = [];
  selectedBenh: any;
  hoveredBenh: any;
  trieuChungTraVe: any[] = [];
  check: any[] = []
  selectedBenh1: boolean = false;
  selectedBenh12: boolean = false;
  newBenh: any;
  isClicked: boolean = true;
  tenBenhDaLay: boolean = false;
  selectedTenBenh: string = ''; // Lưu tên bệnh đã chọn
  selectedTrieuChung: any[] = []; // Lưu danh sách triệu chứng đã chọn

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private dataService: DataService, private dialog: MatDialog) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
  }
  ngOnInit() {

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
  themLuatMoi() {
    this.themBenh = false;
    this.themLuat = true;
  }


  themBenhMoi() {
    this.themBenh = true;
    this.themLuat = false;
    this.dataService.getnewbenh().subscribe(
      response => {
        console.log(response);
        this.benhs = response;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    )
    this.dataService.gettrieuchungcu().subscribe(
      response => {
        console.log(response);
        this.trieuchung = response;
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

    this.dataService.getTrieuChungByMaBenhMoi(benh.ma_benh_moi, this.authService.getID()).subscribe(
      (trieuChung: any[]) => {
        this.selectedBenh1 = true;
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.listTrieuChung = trieuChung;
        this.trieuChungTraVe = trieuChung;
        // Gửi selectedTrieuChung đến API CheckTc
        this.sendSelectedTrieuChungToAPI();
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );

  }
  sendSelectedTrieuChungToAPI() {
    console.log(this.authService.getID())
    console.log(this.trieuChungTraVe);
    // Gọi API CheckTc và gửi danh sách triệu chứng đã chọn
    this.dataService.checkTrieuChung(this.authService.getID(), this.trieuChungTraVe).subscribe(
      (response: any) => {
        // Xử lý response từ API nếu cần
        console.log('Response from CheckTc API:', response);
        this.check = response.message;
        console.log(this.check);
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error sending selected trieu chung to API:', error);
      }
    );
  }
  // Thêm vào class TaskbarKsComponent
// Trong hàm showNewBenhDetails
showNewBenhDetails() {
  this.selectedBenh12 = true;
  if (this.selectedBenh) {
    const newBenh = {
      trieuChung: [] // Thêm triệu chứng vào đây nếu có
    };
    this.newBenh = newBenh;
    this.selectedTrieuChung = []; // Khởi tạo mảng chứa các triệu chứng đã chọn
    this.selectedTenBenh = ''; // Đặt lại giá trị của tên bệnh đã chọn
  }
}

selectTrieuChung(benh: any) {
  //console.log("Tên bệnh " + this.selectedTenBenh);
  //console.log("Danh sách TC: " + this.selectedTrieuChung);
  if (!benh.isClicked) {
    benh.isClicked = true; // Đánh dấu triệu chứng là đã chọn
    if (this.newBenh) {
      if (!this.selectedTenBenh) {
        this.selectedTenBenh = this.selectedBenh?.ten_benh_moi || '';
      }
      
      this.selectedTrieuChung.push({
        tenBenh: this.selectedTenBenh,
        tenTrieuChung: benh[1]
      });
      
      console.log("a"+this.selectedTrieuChung);
      
    }
  }
}

SaveNewBenh() {
  const trieuChungList = this.selectedTrieuChung.map((item) => ({
    trieu_chung: item.tenTrieuChung
  }));

  this.dataService
    .SaveNewBenh(
      this.authService.getID(),
      this.selectedTenBenh,
      this.selectedBenh.loai_he,
      trieuChungList
    ).subscribe(
    (response: any) => {
      if (response && response.message === "Success") {
        console.log('Đã lưu bệnh mới:', this.newBenh.trieuChung);
        // Sau khi lưu thành công, đặt lại trạng thái (nếu cần)
        this.showNewBenhDetails(); // Đặt lại trạng thái sau khi lưu thành công
      } else {
        console.error('');
      }
    },
    (error: HttpErrorResponse) => {
      if (error.status === 400) {
        // Xử lý lỗi khi cần thiết
      } else {
        // Xử lý lỗi khi cần thiết
      }
    }
  );
}


}