import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
@Component({
  selector: 'app-taskbar-qtv',
  templateUrl: './taskbar-qtv.component.html',
  styleUrls: ['./taskbar-qtv.component.css']
})
export class TaskbarQtvComponent implements OnInit {
  id: any;
  users: any[] = [];
  fullname=localStorage.getItem('fullname');
  constructor(private router: Router, private authService: AuthService,private dataService:DataService ) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(
      data => {
        this.users = data;
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
  onFullnameChange(event: any, user: any) {
    user.fullname = event.target.innerText;
  }
  
  onRoleChange(event: any, user: any) {
    user.role = event.target.innerText;
  }
  
  onPhoneNumberChange(event: any, user: any) {
    user.phonenumber = event.target.innerText;
  }
  // deleteUser(user: any) {
  //   const userId = user.id_user; // Lấy ID người dùng cần xóa
  //   this.dataService.deleteUser(userId).subscribe(
  //     () => {
  //       // Xóa người dùng khỏi danh sách hiển thị
  //       this.users = this.users.filter(u => u.id_user !== userId);
  //     },
  //     error => {
  //       console.error('Error deleting user: ', error);
  //     }
  //   );
  // }

  // // Lưu thông tin người dùng đã chỉnh sửa
  // editUser(user: any) {
  //   this.dataService.updateUser(user).subscribe(
  //     updatedUser => {
  //       // Cập nhật thông tin người dùng trong danh sách hiển thị
  //       const index = this.users.findIndex(u => u.id_user === updatedUser.id_user);
  //       if (index !== -1) {
  //         this.users[index] = updatedUser;
  //       }
  //     },
  //     error => {
  //       console.error('Error updating user: ', error);
  //     }
  //   );
  // }
  
}

