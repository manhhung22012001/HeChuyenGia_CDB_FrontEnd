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
  fullname=localStorage.getItem('fullname');
  constructor(private router: Router, private authService: AuthService, private dataService:DataService) { }

  ngOnInit(): void {
    this.dataService.getBenh().subscribe(
      data => {
        this.benhs = data;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    );
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id = key;
    this.router.navigate(['/' + this.id]);
  }
  onRowDoubleClick(benh: any) {
    // Gửi dữ liệu của dòng được chọn về backend
    this.dataService.sendDataToBackend(benh).subscribe(response => {
      // Xử lý phản hồi từ backend nếu cần
    });
  }
}
