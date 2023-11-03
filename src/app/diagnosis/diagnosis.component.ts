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
  detailSymptoms1: any[] = [];
  diagnosisResult: string = '';
  showStep2: boolean = false; // Biến để kiểm soát việc hiển thị bước 2
  showStep3: boolean = false;
  trieuChungList: any[] = [];
  basicSymptomsInitial: any[] = [];
  danh_sach_tc: string[] = [];
  ketqua: any[] = [];
  ketqua1: any[] = [];


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
      // lấy các mã tc đã chọn ở b1 cho vào mảng selectedSymptomCodes
      const selectedSymptomCodes = this.trieuChungList
        .filter(trieuChung => trieuChung.isSelected)
        .map(trieuChung => trieuChung[0]);
    
      this.DiagnosticService.searchDiagnosis(selectedSymptomCodes).subscribe(
        data => {
          this.detailSymptoms = data;
          this.detailSymptoms1 =[...this.detailSymptoms];
          this.showStep2 = true;
        },
        error => {
          console.error('Error loading detail symptoms: ', error);
        }
      );
    
      
    }
    

  diagnoseDisease() {
    // lấy các mã tc đã chọn ở b1 cho vào mảng selectedSymptomCodes
    const selectedSymptomCodes = this.trieuChungList
    .filter(trieuChung => trieuChung.isSelected)
    .map(trieuChung => trieuChung[0]);
    // lấy các mã tc đã chọn ở b2
    const selectedSymptomCodes1 = this.detailSymptoms
    .filter(trieuChung => trieuChung.isSelected)
    .map(trieuChung => trieuChung.ma_trieu_chung);
    // Ghép mảng mã triệu chứng cơ bản và mã triệu chứng chi tiết
    this.danh_sach_tc = [...selectedSymptomCodes, ...selectedSymptomCodes1];
    console.log("Danh sach gui di la "+ this.danh_sach_tc)
    // this.DiagnosticService.KQ_cdb(this.danh_sach_tc).subscribe(
    //   data => {
    //     this.ketqua = data;
    //     this.showStep3=true;
    //   },
    //   error => {
    //     console.error('Error loading detail symptoms: ', error);
    //   }
    // );
    this.DiagnosticService.KQ_cdb(this.danh_sach_tc).subscribe(
      data => {
        this.ketqua = data;
        // Nếu không có bệnh nào được tìm thấy, hiển thị tất cả các bệnh có chứa ít nhất một triệu chứng đã chọn
        if (this.ketqua.length === 0) {
          this.DiagnosticService.KQ_cdb1(this.danh_sach_tc).subscribe(
            benhData => {
              this.ketqua1 = benhData;
              this.showStep3 = true;
            },
            error => {
              console.error('Error loading diseases containing selected symptoms: ', error);
            }
          );
        } else {
          this.showStep3 = true;
        }
      },
      error => {
        console.error('Error loading detail symptoms: ', error);
      }
    );
    
  }
}


 

