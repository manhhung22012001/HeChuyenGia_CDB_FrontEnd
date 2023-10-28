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
  detailSymptoms: string[] = [];
  diagnosisResult: string = '';
  trieuChungList: any[] = [];

  constructor(private DiagnosticService: DiagnosticService) { }
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


 
}
