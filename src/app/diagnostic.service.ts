import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  BASE_PATH = environment.baseUrl;
  constructor(private http: HttpClient) { }
 
  getTrieuChungWithCountGreaterThanSix(): Observable<any[]> {
    return this.http.post<any[]>(this.BASE_PATH +"/diagnosis/search1", {});
  }

  // searchDiagnosis(selectedSymptomCodes: string[]): Observable<any[]> {
  //   return this.http.post<any[]>(this.BASE_PATH + "/diagnosis/search2", selectedSymptomCodes);
  // }
  searchDiagnosis(selectedSymptomCodes: string[]): Observable<any[]> {
    return this.http.post<any[]>(this.BASE_PATH + "/diagnosis/search2", selectedSymptomCodes)
      .pipe(
        tap(data => console.log("Data from server:", data)),
        catchError(error => {
          console.error("Error from server:", error);
          throw error;
        })
      );
  }
  
  
  
}
