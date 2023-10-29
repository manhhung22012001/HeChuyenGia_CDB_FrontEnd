import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';
import { DiagnosticService } from '../diagnostic.service';
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

  constructor(private DiagnosticService: DiagnosticService, private DataService: DataService) { }
  ngOnInit(): void {
    this.DiagnosticService.getTrieuChungWithCountGreaterThanSix().subscribe(
      data => {
        this.trieuChungList = data;
      },
      error => {
        console.error('Error loading trieu chung data: ', error);
      }
    );
  }
  
  loadBasicSymptoms() {
    this.DataService.getBasicSymptoms().subscribe(data => {
      this.basicSymptoms = data;
    });
  }

  loadDetailSymptoms() {
    this.DataService.getDetailSymptoms(this.basicSymptoms).subscribe(data => {
      this.detailSymptoms = data;
      // Biến để kiểm soát việc hiển thị bước 2
     
    });
    this.showStep2 = true;
  }

  diagnoseDisease() {
    this.DataService.diagnoseDisease(this.basicSymptoms, this.detailSymptoms).subscribe(data => {
      this.diagnosisResult = data;
      
    });
    this.showStep3=true;
  }
}


 

