import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, catchError, tap } from 'rxjs';


export interface BasicSymptom {
    id:number;
    name:string;

}
export interface DetailSymptom{

}

@Injectable({
    providedIn: 'root'
  })
export class DataService {
  //private apiUrl = 'http://localhost:8080/auth/trieu-chung/count-greater-than-six';
   private baseUrl = 'http://localhost:8080'; // Đổi thành URL của API backend của bạn
  rootURL = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

 
  getDetailSymptoms(basicSymptoms: string[]): Observable<any> {
    return this.http.post(`${this.rootURL}/detail-symptoms`, basicSymptoms);
  }

  diagnoseDisease(basicSymptoms: string[], detailSymptoms: string[]): Observable<any> {
    return this.http.post(`${this.rootURL}/diagnose`, { basicSymptoms, detailSymptoms });
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.rootURL}/taskbar-qtv/getall`)
    .pipe(
      tap(data => console.log("Data from server:", data)),
      catchError(error => {
        console.error("Error from server:", error);
        throw error;
      })
    );
  }
}
