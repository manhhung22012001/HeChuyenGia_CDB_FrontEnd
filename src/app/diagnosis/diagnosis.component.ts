import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';
import { DiagnosticService } from '../diagnostic.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})

export class DiagnosisComponent implements OnInit{
  basicSymptoms: string[] = [];
  detailSymptoms: any[] = [];
  diagnosisResult: string = '';
  showStep2: boolean = false; // Biến để kiểm soát việc hiển thị bước 2
  showStep3: boolean = false;
  trieuChungList: any[] = [];
  basicSymptomsInitial: any[] = [];

  constructor(
    private DiagnosticService: DiagnosticService,
     private DataService: DataService,
     private http: HttpClient // Inject HttpClient service
     ) { }
     ngOnInit(): void {
      this.DiagnosticService.getTrieuChungWithCountGreaterThanSix().subscribe(
        data => {
          this.trieuChungList = data;
          this.basicSymptomsInitial = [...this.trieuChungList];
        },
        error => {
          console.error('Error loading trieu chung data: ', error);
        }
      );
    }
    
  

    loadDetailSymptoms() {
      const selectedSymptomCodes = this.trieuChungList
        .filter(trieuChung => trieuChung.isSelected)
        .map(trieuChung => trieuChung[0]);
    
      this.DiagnosticService.searchDiagnosis(selectedSymptomCodes).subscribe(
        data => {
          this.detailSymptoms = data;
        },
        error => {
          console.error('Error loading detail symptoms: ', error);
        }
      );
    
      this.showStep2 = true;
    }
    

  diagnoseDisease() {
    this.showStep3=true;
  }
}


 

