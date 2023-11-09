import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rootURL = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Hàm này trả về các options cho HTTP requests, bao gồm Authorization header chứa token JWT
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Thêm token vào Authorization header
    });
    return { headers: headers };
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
  getBenhbyhe(loai_he:number):Observable<any[]>{
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-cg/getall12/${loai_he}`, httpOptions);
  }

  getTrieuChungByMaBenh(maBenh: number): Observable<any[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<any[]>(`${this.rootURL}/taskbar-cg/trieuchung/${maBenh}`, httpOptions);
  }
}
