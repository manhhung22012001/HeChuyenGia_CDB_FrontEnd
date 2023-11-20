import { Component } from '@angular/core';
// import { PdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-qtv-cgmanage',
  templateUrl: './qtv-cgmanage.component.html',
  styleUrls: ['./qtv-cgmanage.component.css']
})
export class QtvCgmanageComponent {
  userDetails: any; // Khai báo thuộc tính userDetails ở đây
  fullname: any;
  constructor(private route: ActivatedRoute, private dataService: DataService,private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
   }
  ngOnInit() {
    // Lấy dữ liệu từ queryParams
     // Lấy dữ liệu từ DataService
     this.userDetails = this.dataService.getUserDetails();
    //  const userId=this.userDetails.id_user;
    //  var url:any={
    //   anhdaidien:this.userDetails.anhdaidien,
    //   bangTotNghiepYKhoa:this.userDetails.bangTotNghiepYKhoa,
    //   chungChiHanhNghe:this.userDetails.chungChiHanhNghe,
    //   chungNhanChuyenKhoa:this.userDetails.chungChiHanhNghe

    //  }
    //  this.dataService.getFile(userId,url).subscribe(
    //   (response: any) => {
    //     console.log(response);
    //     })
    //   }
   
}
onLinkClick(filePath: string) {
  this.dataService.getFileContent(filePath).subscribe((data: Blob) => {
    const fileURL = URL.createObjectURL(data);
    window.open(fileURL); // Mở tệp trong tab mới
  });
}
}
