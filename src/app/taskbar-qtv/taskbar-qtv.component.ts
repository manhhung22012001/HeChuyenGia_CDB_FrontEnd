import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-taskbar-qtv',
  templateUrl: './taskbar-qtv.component.html',
  styleUrls: ['./taskbar-qtv.component.css']
})
export class TaskbarQtvComponent implements OnInit {
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

