import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BASE_PATH = 'http://localhost:8080';
  BASE_PATH = environment.baseUrl;
  USER_NAME_SESSION = 'username_session';
  ID_USER = 'id_user';
  public username: string | undefined;
  public password: string | undefined;
  public userRole: number;
  public id: any;
  results: string[] | undefined;
  constructor(private http: HttpClient) {
    this.userRole=1;
   }
  login(username: string, password: string) {
    var params = new HttpParams()
      .set('username', username)
      .set('password', password)
     
    return this.http.post<Response>(this.BASE_PATH + "/auth/login", params, { observe: 'response' });
  }
  register(fullname: string, phonenumber: number, user: string, pass: string, role: number) {
    return this.http.post<Response>(this.BASE_PATH + "/auth/register", { username: user, password: pass, fullname: fullname, phonenumber: phonenumber, role: role }, { observe: 'response' });
  }
  createBasicAuthToken() {
    console.log(this.username + ":" + this.password);
    return 'Basic ' + window.btoa(this.username + ":" + this.password);
  }
  registerSuccessfulLogin(username: any) {
    sessionStorage.setItem(this.USER_NAME_SESSION, username);
  }
  setID(id: any) {
    localStorage.setItem(this.ID_USER, id);
  }
  logout() {
    sessionStorage.removeItem(this.USER_NAME_SESSION);
    this.username = '';
    this.password = '';
  }
  isUserLoggedIn() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION);
    if (user === null) return false;
    return true;
  }
  getLoggedInUserName() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION);
    if (user === null) return ''
    return user;
  }
  getId() {
    let id = localStorage.getItem(this.ID_USER);
    if (id === null) return '';
    return id;
  }
  setUserRole(role: number) {
    this.userRole = role;
  }

  getUserRole(): number {
    return this.userRole;
  }
}
