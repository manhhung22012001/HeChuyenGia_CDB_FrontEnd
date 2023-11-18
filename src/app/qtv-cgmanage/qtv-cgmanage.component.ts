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
     console.log('Received User Details:', this.userDetails);
  }
}
