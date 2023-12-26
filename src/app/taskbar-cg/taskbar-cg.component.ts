import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-taskbar-cg',
  templateUrl: './taskbar-cg.component.html',
  styleUrls: ['./taskbar-cg.component.css']
})
export class TaskbarCgComponent implements OnInit {
  id_user: any;
  benhs: any[] = [];
  listTrieuChung: any[] = [];
  trieuChungArray: any[] = [{ trieuChung: '' }];
  fullname: any;
  selectedBenh: any; // Khai báo biến selectedBenh để lưu trữ bệnh được chọn
  hoveredBenh: any;
  loai_he: String = '';
  isAddingNewBenh: boolean = false;
  errorMessage: string = '';
  newBenh: FormGroup;
  suggestedTrieuChung: any[][] = [];
  searchControl = new FormControl();
  suggestedTenBenh: string[] = [];
  tenBenhControl = new FormControl();
  @ViewChild('autoTenBenh') autoTenBenh!: MatAutocomplete;
  // biến để thêm tc mới
  isAddNewTC: boolean = false;
  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private fb: FormBuilder, private dialog: MatDialog) {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
    this.id_user = localStorage.getItem('id_user');

    this.newBenh = this.fb.group({
      ten_benh: ['', Validators.required],
      loai_he: ['', Validators.required],
      trieu_chung: this.fb.array([this.createTrieuChungFormGroup()])
    });

  }

  ngOnInit() {

    const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
    for (let i = 0; i < trieuChungArray.length; i++) {
      this.suggestedTrieuChung.push([]); // Tạo một mảng rỗng cho mỗi trường nhập
    }
    // hàm gợi ý khi viết tên bệnh 
    this.tenBenhControl.valueChanges
      .pipe(
        debounceTime(300),// chờ 300ms khi ng dùng nhập xong mới gửi đến be
        distinctUntilChanged(),//Đảm bảo chỉ gọi service khi giá trị mới khác với giá trị trước đó
        switchMap(keyword => this.dataService.searchTenBenhByKey(keyword))// Khi giá trị thay đổi, sử dụng switchMap để chuyển đổi giá trị này thành một observable khác (this.dataService.searchTenBenhByKey(keyword)) và sử dụng nó thay thế. Điều này giúp hủy bỏ các yêu cầu trước đó nếu chúng chưa hoàn thành và chỉ lấy kết quả của yêu cầu mới nhất.
      )
      .subscribe(
        (response) => {
          this.suggestedTenBenh = response;
        },
        (error) => {
          console.error('Lỗi:', error);
        }
      );
  }
  onTenBenhInput(event: any) {
    const enteredText = event.target.value;
    const capitalizedText = this.capitalizeFirstLetter(enteredText);

    this.tenBenhControl.patchValue(capitalizedText);

    this.dataService.searchTenBenhByKey(capitalizedText).subscribe((suggestions) => {
      this.suggestedTenBenh = suggestions;
    });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  onKeyDown(event: KeyboardEvent, index: number) {
    // Kiểm tra nếu phím ấn là phím cách (Space)
    if (event.key === ' ') {
      // Gọi API tìm kiếm với từ khoá là giá trị hiện tại trong ô input
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((keyword) => this.dataService.searchTrieuChung(keyword))
      ).subscribe((suggestions) => {
        this.suggestedTrieuChung[index] = suggestions;
      });

      // event.preventDefault(); // Ngăn chặn hành vi mặc định của phím cách trong input
    }
  }

  // Trong component của bạn
  createTrieuChungFormGroup(): FormGroup {
    const newTrieuChungGroup = this.fb.group({
      trieu_chung: ['', Validators.required]
    });

    // Tạo một mảng gợi ý mới cho ô nhập triệu chứng vừa được thêm vào
    this.suggestedTrieuChung.push([]);

    return newTrieuChungGroup;
  }

  // Thêm phương thức displayFn để hiển thị gợi ý trong dropdown
  displayFn(value: string): string {
    return value;
  }
  onTrieuChungInput(event: any, index: number) {
    const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
    const trieuChungControl = trieuChungArray.controls[index].get('trieu_chung');
    // xử lý ghi chữ hoa
    if (trieuChungControl) {
      const enteredText = event.target.value;
      const capitalizedText = enteredText.charAt(0).toUpperCase() + enteredText.slice(1).toLowerCase();

      trieuChungControl.patchValue(capitalizedText);

      // Gọi service để lấy gợi ý dựa trên chuỗi đã viết hoa
      this.dataService.searchTrieuChung(capitalizedText).subscribe((suggestions) => {
        this.suggestedTrieuChung[index] = suggestions;
      });
    }
  }



  onTrieuChungSelected(index: number, event: any) {
    const selectedValue = event.option.viewValue;
    this.searchControl.setValue(selectedValue);

    this.suggestedTrieuChung[index] = [selectedValue];
  }

  logout() {
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id_user = key;
    this.router.navigate(['/' + this.id_user]);
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
    this.isAddNewTC = false;
    this.newBenh = this.fb.group({
      ten_benh: ['', Validators.required],
      loai_he: ['', Validators.required],
      trieu_chung: this.fb.array([this.createTrieuChungFormGroup()])
    });
  }
  updateTrieuChung(value: string, index: number): void {
    const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
    trieuChungArray.at(index).patchValue({ trieu_chung: value });
  }

  addNewTrieuChungIfLast(index: number): void {
    const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
    if (index === trieuChungArray.length - 1) {
      trieuChungArray.push(this.createTrieuChungFormGroup());
    }

    // Sau khi thêm mới, đảm bảo mảng suggestedTrieuChung có đúng số lượng ô nhập
    if (!this.suggestedTrieuChung[index + 1]) {
      this.suggestedTrieuChung.push([]);
    }
  }

  removeTrieuChung(index: number): void {
    const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
    trieuChungArray.removeAt(index);

    // Sau khi xóa, cũng xóa phần tử tương ứng trong mảng suggestedTrieuChung
    this.suggestedTrieuChung.splice(index, 1);
  }
  get trieuChungControls() {
    return (this.newBenh.get('trieu_chung') as FormArray).controls;
  }





  saveNewBenh() {
    const status = '0';
    const ghi_chu = 'Chưa thêm vào CSDL';
    if (!this.tenBenhControl.value || !this.newBenh.value.loai_he || !this.newBenh.value.trieu_chung) {
      // Kiểm tra nếu có trường nào đó bị rỗng hoặc null, thông báo lỗi hoặc xử lý phù hợp
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.';
      return;
    }
    this.dataService.addNewBenh(this.id_user, this.tenBenhControl.value, this.newBenh.value.loai_he, this.newBenh.value.trieu_chung, status, ghi_chu)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response && response.message === 'Success') {
            this.dialog.open(ConfirmComponent, {
              width: '550px',
              data: {
                title: 'Thông báo: Thành Công',
                message: 'Bệnh đã được gợi ý thêm vào CS Tri thức',
                okButton: true
              }

            });
            this.isAddingNewBenh = false;
            this.isAddNewTC = false;
            // this.ngOnInit();
            // Sau khi lưu xong, reset form để làm rỗng các trường
            this.newBenh.reset();

          } else if (response && response.message === 'Ten benh, loai he hoac trieu chung rong') {

            // Hiển thị thông báo lỗi
            this.errorMessage = response.message;
          } else if (response && response.message === 'Ten benh da ton tai') {
            this.errorMessage = "Tên bệnh đã tồn tại, vui lòng thêm bệnh mới";

          }

          else if (response && response.message === 'Error') {


            // Hiển thị thông báo lỗi
            this.dialog.open(ConfirmComponent, {
              width: '550px',
              data: {
                title: 'Thông báo: Lỗi',
                message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                okButton: true
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
          } else {
            this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
          }
        }
      );

  }
  addNewTC() {
    this.isAddNewTC = true;
    this.isAddingNewBenh = false;
  }




  saveNewTC() {
    const status = '0';
    const ghi_chu = 'Chưa thêm vào CSDL';


    const ma_benh = this.selectedBenh.ma_benh;
    const ten_benh = this.selectedBenh.ten_benh;
    const trang_thai = 0;

    this.dataService.addSuggestTC(this.id_user, ma_benh, ten_benh, this.newBenh.value.trieu_chung, trang_thai)
      .subscribe(
        (response: any) => {
          console.log("Danh sach: " + response.duplicatedSymptoms);
          console.log("response.message: " + response.message);
          console.log("Response:" + response);
          if (response && response.message === 'Success') {
            this.dialog.open(ConfirmComponent, {
              width: '550px',
              data: {
                title: 'Thông báo: Thành Công',
                message: 'Bệnh đã được gợi ý thêm vào CS Tri thức',
                okButton: true
              }
            });
            this.isAddingNewBenh = false;
            this.isAddNewTC = false;
            this.ngOnInit();
          } else if (response && response.message === 'Error: Trung trieu chung') {
            if (response.duplicatedSymptoms && response.duplicatedSymptoms.length > 0) {
              this.dialog.open(ConfirmComponent, {
                width: '550px',
                data: {
                  title: 'Thông báo: Lỗi',
                  message: 'Triệu Chứng Thêm Đã Bị Trùng. Các triệu chứng: ' + response.duplicatedSymptoms.join(', '),
                  okButton: true
                }
              });
            } else {
              this.dialog.open(ConfirmComponent, {
                width: '550px',
                data: {
                  title: 'Thông báo: Lỗi',
                  message: 'Vui lòng nhập đầy đủ thông tin.',
                  okButton: true
                }
              });
            }
          } else if (response && response.message === 'Thieu tham so ten_benh, loai_he hoac trieu_chung') {
            this.dialog.open(ConfirmComponent, {
              width: '550px',
              data: {
                title: 'Thông báo: Lỗi',
                message: 'Thiếu thông tin tên bệnh hoặc triệu chứng.',
                okButton: true
              }
            });
          } else {
            this.dialog.open(ConfirmComponent, {
              width: '550px',
              data: {
                title: 'Thông báo: Lỗi',
                message: 'Đã xảy ra lỗi không xác định.',
                okButton: true
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
          } else {
            this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
          }
        }
      );

    // Sau khi lưu xong, reset form để làm rỗng các trường
    this.newBenh.reset();
  }
  // updateSelectedBenhName(newValue: string) {
  //   this.selectedBenh.ten_benh = newValue;
  // }

}
