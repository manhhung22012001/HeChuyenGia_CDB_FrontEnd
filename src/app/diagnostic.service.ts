import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  private apiUrl = 'http://localhost:8080/auth/diagnostic';
  constructor(private http: HttpClient) { }
  getTrieuChungWithCountGreaterThanSix(): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, {});
  }
}
