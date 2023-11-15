import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BASE_PATH = 'http://localhost:8080';
  BASE_PATH = environment.baseUrl;
  USER_NAME_SESSION = 'username_session';
  ID_USER = 'id_user';
  private secretKey = 'lodaaaaaa';
  public username: string | undefined;
  public password: string | undefined;
  public userRole: number;
  public id_user: any;
  public fullname :any;
  public email :any;
  public phonenumber :any;
  public status:any;
  results: string[] | undefined;
  constructor(private http: HttpClient) {
    this.userRole=1;
   }
   login(username: string, password: string) {
    const body = {
      username: username,
      password: password
    };
  
    return this.http.post<Response>(this.BASE_PATH + "/auth/login", body, { observe: 'response' });
  }
  
  register(fullname: string,email:string, phonenumber: string, username: string, password: string, role: number) {
    return this.http.post<Response>(this.BASE_PATH + "/auth/register", { fullname: fullname, email:email, phonenumber: phonenumber, username:username,password:password,role: role  }, { observe: 'response' });
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
  getCurrentLoggedInUser(){
    let id = sessionStorage.getItem(this.ID_USER);
    if (id === null) return '';
    return id;
  }
  getId() {
    let id = localStorage.getItem(this.ID_USER);
    if (id === null) return '';
    return id;
  }
  getID():number {
    let idString = localStorage.getItem(this.ID_USER);
    if (idString === null) return 0; // hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
    return parseInt(idString, 10);
  }
  
  setUserRole(role: number) {
    this.userRole = role;
  }

  getUserRole(): number {
    return this.userRole;
  }
  public setToken(token: string){
    
    localStorage.setItem('token',token);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.userRole = decodedToken.role;
    this.fullname= decodedToken.fullname;
    this.id_user=decodedToken.id;
    this.status=decodedToken.status;
    // Save user ID in local storage
    
    localStorage.setItem('phonenumber', decodedToken.phonenumber);
    localStorage.setItem('email', decodedToken.email);
    const expirationDate =helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    localStorage.setItem('fullname',this.fullname);
    localStorage.setItem('id_user', this.id_user);
    
    

  }
  checkUserInfo(username: string, phonenumber: string,email:string): Observable<any> {
    // Gửi yêu cầu POST đến API backend và trả về kết quả dưới dạng Observable
    return this.http.post<any>(this.BASE_PATH + "/auth/forgotpass", { username, phonenumber,email });
  }
  checkOTP(email:string, otp:string): Observable<any> {
    // Gửi yêu cầu POST đến API backend và trả về kết quả dưới dạng Observable
    return this.http.post<any>(this.BASE_PATH + "/auth/CheckOTP", { email,otp });
  }
  resetpass(username:string,password:string):Observable<any> {
    // Gửi yêu cầu POST đến API backend và trả về kết quả dưới dạng Observable
    return this.http.post<Response>(this.BASE_PATH + "/auth/reset-password", { username,password }, { observe: 'response' });
  }
  qtvregister(fullname: string,email:string, phonenumber: string, username: string, password: string, role: number,status:string) {
    return this.http.post<Response>(this.BASE_PATH + "/auth/register", { fullname: fullname, email:email, phonenumber: phonenumber, username:username,password:password,role: role ,status:status }, { observe: 'response' });
  }
}
