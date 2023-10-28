import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})

export class DiagnosisComponent implements OnInit{
  basicSymptoms: string[] = [];
  detailSymptoms: string[] = [];
  diagnosisResult: string = '';
  trieuChungList: any[] = [];

  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getTrieuChungWithCountGreaterThanSix().subscribe(
      data => {
        this.trieuChungList = data;
      },
      error => {
        console.error('Error loading trieu chung data: ', error);
      }
    );
  }


  loadBasicSymptoms() {
    this.dataService.getBasicSymptoms().subscribe(data => {
      this.basicSymptoms = data;
    });
  }

  loadDetailSymptoms() {
    this.dataService.getDetailSymptoms(this.basicSymptoms).subscribe(data => {
      this.detailSymptoms = data;
    });
  }

  diagnoseDisease() {
    this.dataService.diagnoseDisease(this.basicSymptoms, this.detailSymptoms).subscribe(data => {
      this.diagnosisResult = data;
    });
  }
}
