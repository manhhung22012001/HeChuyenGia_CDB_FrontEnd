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
  ma_benh_moi: any;
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
  showTrieuChung: boolean = false; // Thêm biến showTrieuChung
  showAddNewButton: boolean = false;
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
    this.showTrieuChung = true;
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
    // this.selectedBenh12 = true;
    // this.showTrieuChung = true;

    if (this.selectedBenh) {
      this.showAddNewButton = this.selectedBenh.ghi_chu === 'Chưa thêm vào CSDL';
      this.selectedBenh12 = true;
      this.showTrieuChung = true;
      const newBenh = {
        trieuChung: [] // Thêm triệu chứng vào đây nếu có
      };
      this.newBenh = newBenh;
      this.selectedTrieuChung = []; // Khởi tạo mảng chứa các triệu chứng đã chọn
      this.selectedTenBenh = ''; // Đặt lại giá trị của tên bệnh đã chọn
    }

  }

  selectTrieuChung(benh: any) {
    if (!benh.isClicked) {
      if (this.newBenh) {
        if (!this.selectedTenBenh) {
          this.selectedTenBenh = this.selectedBenh?.ten_benh_moi || '';
        }
  
        // Kiểm tra nếu triệu chứng không phải là "TC không tồn tại"
        if (this.check[this.listTrieuChung.indexOf(benh)] == null) {
          this.selectedTrieuChung.push({
            tenBenh: this.selectedTenBenh,
            tenTrieuChung: benh[1]
          });
        }
      }
  
      benh.isClicked = true; // Đánh dấu triệu chứng là đã chọn
    }
  }
  
  selectBenh1(benh: any) {
    this.ma_benh_moi = benh.ma_benh_moi; // Lưu ID của bệnh được chọn
    // Các thao tác khác nếu cần
  }

  SaveNewBenh() {
    const trieuChungList = this.selectedTrieuChung.map((item) => ({
      trieu_chung: item.tenTrieuChung
    }));
    const ghi_chu = "Đã lưu vào CSDL";
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '550px',

      data: { message: 'Thông báo! Bạn có chắc chắn muốn lưu Bệnh mới?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Gửi yêu cầu lưu thông tin khi người dùng xác nhận
        this.dataService
          .SaveNewBenh(
            this.authService.getID(),
            this.selectedTenBenh,
            this.selectedBenh.loai_he,
            trieuChungList,
            ghi_chu
          )
          .subscribe(
            (response: any) => {

              // Xử lý kết quả từ API sau khi lưu
              this.dialog.open(ConfirmComponent, {
                width: '550px',
                data: { message: 'Thêm Bệnh Thành công', okButton: true }
              });
              this.themBenhMoi();
              this.showAddNewButton = false;
            },
            (error: HttpErrorResponse) => {
              // Xử lý lỗi nếu có
              this.dialog.open(ConfirmComponent, {
                width: '550px',
                data: { message: 'Thêm Bệnh Không Thành công', okButton: true }

              });
              this.themBenhMoi();
            }
          );
      }
    });
  }
  getBenhList() {
    this.dataService.getnewbenh().subscribe(
      response => {
        console.log(response);
        this.benhs = response;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    )
  }



}