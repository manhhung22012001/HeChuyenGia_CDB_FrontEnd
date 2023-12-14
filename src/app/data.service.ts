import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rootURL = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.http = http;
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
  getBenhbyhe(loai_he: number): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-cg/getall12/${loai_he}`, httpOptions);
  }

  getTrieuChungByMaBenh(maBenh: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.rootURL}/diagnosis/trieuchung/${maBenh}`);
  }
  getTrieuChungByMaBenhMoi(ma_benh_moi: number, id_user: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const endpoint = `${this.rootURL}/taskbar-qtv/trieuchungmoi/${id_user}?ma_benh_moi=${ma_benh_moi}`;
    return this.http.get(endpoint, httpOptions);

  }
  getTrieuChungSuggestByMaBenhMoi(ma_benh_suggest: number, id_user: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const endpoint = `${this.rootURL}/taskbar-ks/trieuChungSuggestMoi/${id_user}?ma_benh_suggest=${ma_benh_suggest}`;
    return this.http.get(endpoint, httpOptions);

  }
  addNewBenh(userId: number, ten_benh: string, loai_he: string, trieu_chung: string[], trang_thai: string, ghi_chu: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ten_benh: ten_benh,
      loai_he: loai_he,
      trieu_chung: trieu_chung,
      trang_thai: trang_thai,
      ghi_chu: ghi_chu
    };

    return this.http.post<any>(`${this.rootURL}/taskbar-cg/add-benh-va-trieu-chung/${userId}`, requestBody, httpOptions);
  }
  searchTrieuChung(keyword: string): Observable<string[]> {
    const httpOptions = this.getHttpOptions();
    const params = { keyword: '%' + keyword + '%' };

    return this.http.get<string[]>(`${this.rootURL}/taskbar-cg/suggest`, { headers: httpOptions.headers, params }).pipe();
  }
  searchTenBenhByKey(keyword: string): Observable<string[]> {
    const httpOptions = this.getHttpOptions();
    const params = { keyword: '%' + keyword + '%' };
    return this.http.get<string[]>(`${this.rootURL}/taskbar-cg/search`, { headers: httpOptions.headers, params }).pipe();
  }
  getUserInfo(userId: number): Observable<any> {
    const httpOptions = this.getHttpOptions();

    return this.http.get<any>(`${this.rootURL}/taskbar-cg/getuserdetail/${userId}`, httpOptions);
  }

  uploadUserInfo(userId: number, formData: FormData, hoc_ham: string, hoc_vi: string, status: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    formData.append('hoc_ham', hoc_ham);
    formData.append('hoc_vi', hoc_vi);
    formData.append('status', status);
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
  // SaveNewBenh(userId: number, ten_benh: string, loai_he: string, trieuChungList: { trieu_chung: string }[],ghi_chu:String, ma_benh_moi:number): Observable<any> {
  SaveNewBenh(userId: number, ten_benh: string, loai_he: string, trieuChungList: { trieu_chung: string }[], MaList: { ma_trieu_chung: number }[], ghi_chu: String): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ten_benh: ten_benh,
      loai_he: loai_he,
      trieu_chung: trieuChungList,
      ma_trieu_chung: MaList,
      ghi_chu: ghi_chu
    };

    return this.http.post<any>(`${this.rootURL}/taskbar-ks/add-Benh-and_TC/${userId}`, requestBody, httpOptions);
  }
  postBenh(ten_benh: any[]): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ten_benh: ten_benh
    };

    return this.http.post<any>(`${this.rootURL}/taskbar-ks/lay-danh-sach-benh-da-co-luat`, requestBody, httpOptions);
  }
  saveruletype1(userId: number, loai_luat: number, ma_benh: number, trieuChungList: { ma_trieu_chung: number }[]): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ma_benh: ma_benh,
      loai_luat: loai_luat,
      ma_trieu_chung: trieuChungList,

    };

    return this.http.put<any>(`${this.rootURL}/taskbar-ks/save-luat-loai-1/${userId}`, requestBody, httpOptions);
  }
  getBenhOfTrieuChungMoi(){
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-ks/getallBenhOfTtrieuChungMoi`, httpOptions);
  }
  saveruletype3(userId: number, loai_luat: number, ma_benh: number, trieuChungList: { ma_trieu_chung: number }[]): Observable<any> {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ma_benh: ma_benh,
      loai_luat: loai_luat,
      ma_trieu_chung: trieuChungList,

    };

    return this.http.put<any>(`${this.rootURL}/taskbar-ks/save-luat-loai-3/${userId}`, requestBody, httpOptions);
  }

  UpdateSattusUser(userId: number, status: string) {
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      status:status
    };
    return this.http.put<any>(`${this.rootURL}/taskbar-qtv/updateSatusUser/${userId}`, requestBody, httpOptions);
  }
  getCountStatus(){
    const httpOptions = this.getHttpOptions();
    return this.http.get<any>(`${this.rootURL}/taskbar-qtv/getCountStatus`,  httpOptions);
  }
  addSuggestTC(userId: number,ma_benh:number,ten_benh:string,trieu_chung: string[],trang_thai:number){
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ma_benh:ma_benh,
      ten_benh:ten_benh,
      trieu_chung:trieu_chung,
      trang_thai:trang_thai
    };
    return this.http.put<any>(`${this.rootURL}/taskbar-cg/suggest-add-new-TC/${userId}`, requestBody, httpOptions);
  }
  saveTrieuChungSuggest(trieu_chung: any[],ma_benh:number,trang_thai:number,ma_benh_suggest:number){
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ma_benh:ma_benh,
      trieu_chung:trieu_chung,
      trang_thai:trang_thai,
      ma_benh_suggest:ma_benh_suggest
     
    };
    return this.http.put<any>(`${this.rootURL}/taskbar-ks/saveTrieuChungSuggestIntoTrieuChungBenh`, requestBody, httpOptions);
  }
  // gọi API lưu luật từ tc gợi ý mới
  saveLuatTrieuChungSuggest(userId: number, ma_benh:number,existedInDatabase:number[],notExistInDatabase:number[]){
    const httpOptions = this.getHttpOptions();
    const requestBody = {
      ma_benh:ma_benh,
      existedInDatabase:existedInDatabase,
      notExistInDatabase:notExistInDatabase

    };
    return this.http.put<any>(`${this.rootURL}/taskbar-ks/saveLuatTrieuChungSuggestIntoTrieuChungBenh/${userId}`, requestBody, httpOptions);

  }
}
