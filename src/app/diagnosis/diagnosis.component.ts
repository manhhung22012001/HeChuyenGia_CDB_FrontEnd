import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DiagnosticService } from '../diagnostic.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})

export class DiagnosisComponent implements OnInit {
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
  disableBasicSymptoms: boolean = false;
  listTrieuChung: any[] = [];
  show: boolean = false;
  trieuChungOnly: any[] = [];
  basicSymptomsInitialOnly: any[] = [];
  disableSymptoms: boolean = false;
  selectedBenh: any; // Khai báo biến selectedBenh để lưu trữ bệnh được chọn
  hoveredBenh: any;
  selectedBenhs: any[] = [];
  showbasic: boolean = true;
  showonly: boolean = true;
  showKQ: boolean = true;

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
    this.DiagnosticService.getTrieuChungonly().subscribe(
      data => {
        this.trieuChungOnly = data;
        this.basicSymptomsInitialOnly = [...this.trieuChungOnly];
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
    this.disableBasicSymptoms = true;
    // this.showonly = false;
    this.DiagnosticService.searchDiagnosis(selectedSymptomCodes).subscribe(
      data => {
        this.detailSymptoms = data;
        this.detailSymptoms1 = [...this.detailSymptoms];
        this.showStep2 = true;
      },
      error => {
        console.error('Error loading detail symptoms: ', error);
      }
    );


  }
  diagnoseDiseaseonly() {
    // lấy các mã tc riêng biệt cho vào mảng selectedSymptomCodes
    const selectedSymptomCodes = this.trieuChungOnly
      .filter(trieuChung => trieuChung.isSelected)
      .map(trieuChung => trieuChung[0]);
    this.disableSymptoms = true;
    this.showbasic = false;
    this.showKQ=false;
    // Ghép mảng mã triệu chứng cơ bản và mã triệu chứng chi tiết
    this.danh_sach_tc = [...selectedSymptomCodes];
    console.log("Danh sach gui di rieng biet la " + this.danh_sach_tc)

    this.DiagnosticService.KQ_cdb1(this.danh_sach_tc).subscribe(
      data => {
        this.ketqua = data;
        this.showStep3 = true;
        // Nếu không có bệnh nào được tìm thấy, hiển thị tất cả các bệnh có chứa ít nhất một triệu chứng đã chọn

      },
      error => {
        console.error('Error loading detail symptoms: ', error);
      }
    );
  }

  diagnoseDisease() {
    this.showKQ=false;
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
    console.log("Danh sach gui di bthg la " + this.danh_sach_tc)
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
        console.log("lenght: " + this.ketqua.length);
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
  resetDiagnosis(): void {
    // Đặt lại các giá trị người dùng đã chọn và ẩn các bước chuẩn đoán
    this.trieuChungList.forEach(trieuChung => trieuChung.isSelected = false);
    this.detailSymptoms1.forEach(trieuChung => trieuChung.isSelected = false);
    this.showStep2 = false;
    this.showStep3 = false;
    this.disableBasicSymptoms = false;
    this.trieuChungOnly.forEach(trieuChung => trieuChung.isSelected = false);
    this.disableSymptoms = false;
    this.showbasic = true;
    this.showonly = true;
    this.showKQ=true;
  }
  selectBenh(benh: any) {
    this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn
    console.log(benh)
    const existingIndex = this.selectedBenhs.findIndex((selected) => selected.ma_benh === benh.ma_benh);

    if (existingIndex !== -1) {
      // Bệnh đã được chọn trước đó, hủy chọn bệnh này
      this.selectedBenhs.splice(existingIndex, 1);
    } else {
      // Bệnh chưa được chọn, thêm vào mảng
      this.selectedBenhs.push(benh);
    }
    // Chuyển đổi giá trị ma_benh thành số nguyên
    const maBenh = parseInt(benh.ma_benh, 10);
    // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn
    this.DataService.getTrieuChungByMaBenh(benh.ma_benh).subscribe(
      (trieuChung: any[]) => {
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.selectedBenh.trieu_Chung = trieuChung;

      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );


  }
  // onBasicSymptomChange() {
  //   // Khi sự kiện thay đổi của checkbox triệu chứng cơ bản xảy ra
  //   if (this.disableBasicSymptoms) {
  //     this.trieuChungOnly.forEach(trieuChung => {
  //       trieuChung.isSelected = false; // Bỏ chọn tất cả các triệu chứng riêng biệt
  //     });
  //     this.disableSymptoms = true; // Tắt tất cả checkbox triệu chứng riêng biệt
  //   } else {
  //     this.disableSymptoms = false; // Mở lại checkbox triệu chứng riêng biệt
  //   }
  // }
  // onOnlySymptomChange() {
  //   // Khi sự kiện thay đổi của checkbox triệu chứng cơ bản xảy ra
  //   if (this.disableSymptoms) {
  //     this.trieuChungList.forEach(trieuChung => {
  //       trieuChung.isSelected = false; // Bỏ chọn tất cả các triệu chứng riêng biệt
  //     });
  //     this.disableBasicSymptoms = true; // Tắt tất cả checkbox triệu chứng riêng biệt
  //   } else {
  //     this.disableBasicSymptoms = false; // Mở lại checkbox triệu chứng riêng biệt
  //   }
  // }
  toggleSymptomsSelection(isBasic: boolean) {
    if (isBasic) {
      this.disableSymptoms = true;

    } else {
      this.disableSymptoms = false;
      this.disableBasicSymptoms = true;
    }
  }
  X(){
    // hàm này để gọi triệu chứng chi tiết theo các tc đã chọn ở bước 2
    this.loadDetailSymptoms();
  }
  Y() {
    // Kiểm tra xem có ít nhất một triệu chứng riêng biệt được chọn hay không
    const anyOnlySymptomSelected = this.trieuChungOnly.some(trieuChung => trieuChung.isSelected);
  
    if (anyOnlySymptomSelected) {
      // Thực hiện các hành động khi có triệu chứng riêng biệt được chọn
       console.log('Có triệu chứng riêng biệt được chọn');
      // Gọi hàm hoặc thực hiện các hành động khác ở đây
      this.diagnoseDiseaseonly();

    } else {
      // Thực hiện các hành động khi không có triệu chứng riêng biệt được chọn
      console.log('Không có triệu chứng riêng biệt nào được chọn');
      // Hiển thị thông báo hoặc thực hiện các hành động khác ở đây
      this.diagnoseDisease();
    }
  }
  
}




