import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import { FileUploader } from 'ng2-file-upload';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-taskbar-cg0',
  templateUrl: './taskbar-cg0.component.html',
  styleUrls: ['./taskbar-cg0.component.css']
})
export class TaskbarCg0Component implements OnInit {
  fullname: any;
  id: any;
  phonenumber: any;
  email: any;
  user: any = {};
  userDetail: any = {};
  showUpdateView: boolean = false;
  userInformation: any;
  ReactiveForm: any = FormGroup;
  errorMessage: string = '';

  selectedFiles: { file: File, fieldName: string }[] = [];

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private fb: FormBuilder) {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    this.id = localStorage.getItem('id_user');
    this.fullname = localStorage.getItem('fullname');

  }
  ngOnInit(): void {

  }

  updateUserInfo1() {
    console.log(this.id);
    this.dataService.getUserInfo(this.id).subscribe(
      (userInfo: any) => {
        console.log(userInfo);
        if (userInfo) {
         
          // Show the update view
          this.showUpdateView = true;

          this.userInformation = userInfo;
         

        } else {
          // Handle the case where user information is not available
          console.error('User information not found.');
        }
      },
      (error: any) => {
        this.errorMessage="Bạn đã cập nhật thông tin rồi. Vui lòng đợi chúng tôi cập nhật!"

      }
    );

  }


  onSelectFile(event: any, fieldName: string) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push({ file: files[i], fieldName: fieldName });
    }
  }

  saveForm() {
   
  
   
  }

}
