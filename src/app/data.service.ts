import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';


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
  
}
