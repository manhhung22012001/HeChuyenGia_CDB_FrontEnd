import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../data.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators,FormArray ,FormControl} from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  newBenh: FormGroup;
  suggestedTrieuChung: any[][] = [];
  searchControl = new FormControl();
  
  

  

  constructor(private router: Router, private authService: AuthService, private dataService: DataService,private fb: FormBuilder) {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
    this.id = localStorage.getItem('id_user');

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

onTrieuChungInput(index: number) {
  const trieuChungArray = this.newBenh.get('trieu_chung') as FormArray;
  const trieuChungControl = trieuChungArray.controls[index].get('trieu_chung');

  if (
    trieuChungControl &&
    trieuChungControl.value &&
    typeof trieuChungControl.value === 'string'
  ) {
    this.dataService.searchTrieuChung(trieuChungControl.value).subscribe((suggestions) => {
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
    //console.log('Đã lưu bệnh mới:', this.newBenh);
    this.dataService.addNewBenh(this.id, this.newBenh.value.ten_benh, this.newBenh.value.loai_he, this.newBenh.value.trieu_chung).subscribe(
      (response: any) => {
        //console.log(response.status);
        if (response && response.message === "Success") {
          //var code = response.status;
          //console.log(code);
  
         
            this.errorMessage = "Đăng ký thành công";
            console.log('Đã lưu bệnh mới:', this.newBenh);
  
            // Sau khi lưu, đặt lại trạng thái
            this.isAddingNewBenh = false;
           
          
        } else {
          // Handle the case when response or response.status is null or undefined
          console.error('');
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        } else {
          this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        }
      }
    );
  }
  

}
