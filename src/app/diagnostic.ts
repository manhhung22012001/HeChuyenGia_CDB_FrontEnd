import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  private apiUrl = 'http://localhost:8080/auth/diagnostic';

  constructor(private http: HttpClient) { }

  getTrieuChungList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getTrieuChungWithCountGreaterThanSix(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  
  }
}
