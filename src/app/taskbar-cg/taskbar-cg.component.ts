import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-taskbar-cg',
  templateUrl: './taskbar-cg.component.html',
  styleUrls: ['./taskbar-cg.component.css']
})
export class TaskbarCgComponent implements OnInit {
  id: any;
  user=this.authService.getLoggedInUserName();
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id = key;
    this.router.navigate(['/' + this.id]);
  }
}
