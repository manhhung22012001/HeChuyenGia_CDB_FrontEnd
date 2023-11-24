import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpEvent,HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rootURL = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.http=http;
  }

  // Hàm này trả về các options cho HTTP requests, bao gồm Authorization header chứa token JWT
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Thêm token vào Authorization header
    });
    return { headers: headers };
  }
  private userDetails: any;

  setUserDetails(data: any) {
    this.userDetails = data;
  }

  getUserDetails() {
    return this.userDetails;
  }

  // Các hàm API của bạn với mã xác thực JWT
  getDetailSymptoms(basicSymptoms: string[]): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.post(`${this.rootURL}/detail-symptoms`, basicSymptoms, httpOptions);
  }

  diagnoseDisease(basicSymptoms: string[], detailSymptoms: string[]): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.post(`${this.rootURL}/diagnose`, { basicSymptoms, detailSymptoms }, httpOptions);
  }

  getUsers(): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-qtv/getall`, httpOptions);
  }

  deleteUser(userId: any): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const deleteUrl = `${this.rootURL}/taskbar-qtv/delete/${userId}`;
    return this.http.delete(deleteUrl, httpOptions);
  }

  updateUser(userId: number, updatedUser: any): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const url = `${this.rootURL}/taskbar-qtv/edit/${userId}`;
    return this.http.put<any>(url, updatedUser, httpOptions);
  }

  getBenh(): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-cg/getall`, httpOptions);
  }
  gettrieuchungcu(): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-qtv/getallTrieuChungCu`, httpOptions);
  }
  getBenhbyhe(loai_he:number):Observable<any[]>{
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-cg/getall12/${loai_he}`, httpOptions);
  }

  getTrieuChungByMaBenh(maBenh: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.rootURL}/diagnosis/trieuchung/${maBenh}`);
  }
  getTrieuChungByMaBenhMoi(ma_benh_moi: number,id_user:number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const endpoint = `${this.rootURL}/taskbar-qtv/trieuchungmoi/${id_user}?ma_benh_moi=${ma_benh_moi}`;
    return this.http.get(endpoint, httpOptions);
   
  }
  addNewBenh(userId: number, ten_benh: string, loai_he: string, trieu_chung: string[],trang_thai:string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ten_benh: ten_benh,
      loai_he: loai_he,
      trieu_chung: trieu_chung,
      trang_thai:trang_thai
    };
  
    return this.http.post<any>(`${this.rootURL}/taskbar-cg/add-benh-va-trieu-chung/${userId}`, requestBody, httpOptions);
  }
  searchTrieuChung(keyword: string): Observable<string[]> {
    const httpOptions = this.getHttpOptions();
    const params = { keyword: '%' + keyword + '%' };

    return this.http.get<string[]>(`${this.rootURL}/taskbar-cg/suggest`, { headers: httpOptions.headers, params }).pipe();
  }
  getUserInfo(userId: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    
    return this.http.get<any>(`${this.rootURL}/taskbar-cg/getuserdetail/${userId}`, httpOptions);
  }
  
  uploadUserInfo(userId: number, formData: FormData,hoc_ham:string,hoc_vi:string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    formData.append('hoc_ham', hoc_ham);
    formData.append('hoc_vi', hoc_vi);
    return this.http.post<any>(`${this.rootURL}/taskbar-cg0/userinfo/${userId}`, formData, httpOptions);
  }

  getFile(userId: number, user_Id: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const endpoint = `${this.rootURL}/taskbar-qtv/getFile/${userId}?user_Id=${user_Id}`;
  
    return this.http.get(endpoint, httpOptions);
  }
  getFileContent(filePath: string): Observable<any> {
    const params = { filePath: filePath };
    return this.http.get(`${this.rootURL}/taskbar-qtv/get-file-content`, { params: params, responseType: 'blob' });
  }
  getnewbenh(): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-qtv/getallBenhMoi`, httpOptions);
  }
// Trong data service của bạn
savenewtrieuchung(userId: number, updatedTC: any): Observable<any> {
  const httpOptions = this.getHttpOptions();
  const url = `${this.rootURL}/taskbar-qtv/edit-benh-moi-va-trieu-chung-moi/${userId}`;
  return this.http.put<any>(url, updatedTC, httpOptions);
}

checkTrieuChung(userId: number, trieuChungTraVe: any[]): Observable<any> {
  const httpOptions = this.getHttpOptions();
  const url = `${this.rootURL}/taskbar-ks/checkTC/${userId}`;

  // Chuyển đổi mảng triệu chứng thành mảng tên triệu chứng
  const tenTrieuChung = trieuChungTraVe.map(tc => tc[1]).join('');

  const params = new HttpParams().set('ten_trieu_chung', tenTrieuChung);

  return this.http.get(url, { params, ...httpOptions });
}
}
