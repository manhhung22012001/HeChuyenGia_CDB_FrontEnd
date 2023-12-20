import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver';
// hãy import 3 dòng 
// npm install file-saver
// npm install file-saver --save
// npm install @types/file-saver --save-dev

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'app-qtv-cgmanage',
  templateUrl: './qtv-cgmanage.component.html',
  styleUrls: ['./qtv-cgmanage.component.css']
})
export class QtvCgmanageComponent {
  userDetails: any;
  fullname: any;
  userId: any;
  userFiles: { name: string, url: string }[] = [];
  message: string = '';
  statusInGetFile: string = '';
  anhDaiDienData: string = '';
  bangTotNghiepYKhoaData: string = '';
  chungChiHanhNgheData: string = '';
  chungNhanChuyenKhoaData: string = '';
  hocham: String = '';
  hocvi: String = '';
  status: string = '1';
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
    this.userId = localStorage.getItem('id_user');
  }

  ngOnInit(): void {
    this.userDetails = this.dataService.getUserDetails();

    this.dataService.getFile(this.userId, this.userDetails.id_user).subscribe(
      (response: any) => {
        if (response) {
          const files = [
            { data: response.anhdaidien, name: 'Ảnh đại diện' },
            { data: response.bangTotNghiepYKhoa, name: 'Bằng Tốt Nghiệp Y Khoa' },
            { data: response.chungChiHanhNghe, name: 'Chứng Chỉ Hành Nghề' },
            { data: response.chungNhanChuyenKhoa, name: 'Chứng Nhận Chuyên Khoa' }
          ];
          this.hocham = response.hoc_ham;
          this.hocvi = response.hoc_vi;
          this.statusInGetFile = response.status;
          console.log("status " + this.statusInGetFile);
          console.log("id"+this.userDetails.id_user);
          console.log("phone number"+this.userDetails.phonenumber);
          files.forEach(file => {
            if (file.data) {
              const fileTypeIndex = file.data.lastIndexOf(':');
              const base64Data = file.data.substring(0, fileTypeIndex);
              const fileType = file.data.substring(fileTypeIndex + 1);
              const fileName = `${file.name}.${this.getFileExtension(fileType)}`;
              const fileUrl = this.createFileUrl(base64Data, fileType);

              this.userFiles.push({ name: fileName, url: fileUrl });
            } else {
              console.log(`Không có dữ liệu cho tệp ${file.name}.`);
            }
          });
        } else {
          console.log('Không có dữ liệu tệp.');
        }
      },
      (error: any) => {
        console.error(error);
        if (error instanceof HttpErrorResponse) {
          console.error('Lỗi máy chủ:', error.error);
        }
      }
    );
  }

  getFileExtension(fileType: string): string {
    switch (fileType) {
      case 'image/jpeg':
        return 'jpeg';
      case 'image/png':
        return 'png';
      case 'application/pdf':
        return 'pdf';
      // Thêm các case cho các loại file khác ở đây nếu cần
      default:
        return 'unknown';
    }
  }
  createFileUrl(base64Data: string, fileType: string): string {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    // Sử dụng URL.createObjectURL để tạo URL trực tiếp cho file
    const fileUrl = URL.createObjectURL(blob);
    //console.log("URL của file:", fileUrl);

    return fileUrl; // Trả về URL của file thay vì base64Data
  }

  createAndDownloadFile(base64Data: string, fileName: string): void {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: '' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
  downloadFile(file: any): void {
    // Lấy base64 của file từ userFiles dựa trên tên file
    const selectedFile = this.userFiles.find(f => f.name === file.name);
    if (selectedFile) {
      this.createAndDownloadFile(selectedFile.url, selectedFile.name);
    }
  }
  AcceptUser() {
    if (this.statusInGetFile !== '1') {
      const statusUser='1';
      this.dataService.UpdateSattusUser(this.userDetails.id_user,  statusUser).subscribe(
        (response: any) => {
          this.message = "Duyệt Chuyên Gia Thành Công.";

        },
        error => {
          this.message = "Duyệt Chuyên Gia Thất Bại.";

          // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        }
      );
    }
    else {
      this.message = "Bạn đã Duyệt chuyên gia này rồi";
    }
  }
  
}
