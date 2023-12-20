import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';

import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-taskbar-ks',
  templateUrl: './taskbar-ks.component.html',
  styleUrls: ['./taskbar-ks.component.css']
})
export class TaskbarKsComponent implements OnInit {
  id: any;
  ma_benh_moi: any;
  ma_benh_suggest: any;
  fullname: any;
  themLuat: boolean = false;
  themBenh: boolean = false;
  listTrieuChung: any[] = [];
  benhs: any[] = [];
  benhss: any[] = [];
  benhDaco: any[] = [];
  trieuchung: any[] = [];
  selectedBenh: any;
  hoveredBenh: any;
  trieuChungTraVe: any[] = [];
  check: any[] = []
  selectedBenh1: boolean = false;
  selectedBenh12: boolean = false;
  newBenh: any;
  isClicked: boolean = true;
  tenBenhDaLay: boolean = false;
  selectedTenBenh: string = ''; // Lưu tên bệnh đã chọn
  selectedTrieuChung: any[] = [];
  selectedMaTC: any[] = []; // Lưu danh sách triệu chứng đã chọn
  showTrieuChung: boolean = false; // Thêm biến showTrieuChung
  showAddNewButton: boolean = false;
  isAddNewBenhClicked: boolean = false;
  isAddedNewBenh: boolean = false;
  ghi_chu_sau_khi_sua: String = '';
  addrule: boolean = false;
  selectBenhaddrule: any;
  trieuchungaddrule: any;
  saverule1: boolean = false;
  messageaddrule1: string = '';
  ma_tc: any;
  messageaddrule3: string = '';
  saverule3: boolean = false;
  status: any;
  addNewTC: boolean = false;
  message: string = '';
  showBenhAndTC: boolean = false;
  loai_he: String = '';
  statusZeroCount: number = 0;// biến thông báo thêm bệnh
  statusZeroCount1: number = 0;// biến thông báo thêm triệu trứng gợi ý vào bệnh
  notificationOfRule: number = 0;//biến thông báo thêm luật
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private dataService: DataService, private dialog: MatDialog) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.fullname = localStorage.getItem('fullname');
  }
  ngOnInit() {
    this.countRowsWithStatusOne();
    this.notification();
    this.notificationOfLuat();
  }

  logout() {
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  tabChange(key: any) {
    this.id = key;
    this.router.navigate(['/' + this.id]);
  }
  // hàm thông báo của thêm luật
  notificationOfLuat() {
    this.dataService.getBenh().subscribe(
      data => {
        this.benhss = data;
        //console.log(data);
        const tenBenhArray = this.benhss.map(benh => benh.ten_benh);

        // Gửi danh sách tên bệnh đi cùng một lúc thông qua postBenh
        this.dataService.postBenh(tenBenhArray).subscribe(
          response => {

            this.notificationOfRule = response.total;
            //console.log('Tổng số liệu: ', this.notificationOfRule);
            // Gọi phương thức xử lý dữ liệu từ API
            this.xuLyDuLieuTuAPI(response.data); // Giả sử response.data chứa dữ liệu từ API
          },
          error => {
            console.error('Error posting data: ', error);
          }
        );
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    );
  }

  calculateTotal(data: any[]): number {
    // Kiểm tra data có tồn tại và là mảng không
    if (Array.isArray(data) && data.length > 0) {
      // Tính tổng
      return data.reduce((acc, obj) => {
        // Đảm bảo trường số liệu tồn tại và là số
        const value = parseFloat(obj.so_lieu);
        return !isNaN(value) ? acc + value : acc;
      }, 0);
    } else {
      return 0; // Trả về 0 nếu không có dữ liệu hoặc dữ liệu không hợp lệ
    }
  }
  // thêm luật
  themLuatMoi() {
    this.themBenh = false;
    this.themLuat = true;
    this.showBenhAndTC = false;
    this.dataService.getBenh().subscribe(
      data => {
        this.benhss = data;
        console.log(data);
        const tenBenhArray = this.benhss.map(benh => benh.ten_benh);

        // Gửi danh sách tên bệnh đi cùng một lúc thông qua postBenh
        this.dataService.postBenh(tenBenhArray).subscribe(
          response => {
            // Xử lý phản hồi từ việc gửi dữ liệu
            console.log('Data posted successfully: ', response);

            // Gọi phương thức xử lý dữ liệu từ API
            this.xuLyDuLieuTuAPI(response.data); // Giả sử response.data chứa dữ liệu từ API
          },
          error => {
            console.error('Error posting data: ', error);
          }
        );
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    );
  }


  countRowsWithStatusOne() {
    this.dataService.getnewbenh().subscribe(
      response => {
        console.log(response);
        this.benhs = response;

        // Lọc ra các bệnh có trạng thái là '1' và ghi_chu là 'Chưa thêm vào CSDL'
        this.statusZeroCount = this.benhs.filter(item => item.trang_thai === '1' && item.ghi_chu === 'Chưa thêm vào CSDL').length;

        console.log('Số hàng có trạng thái bằng 0 và ghi_chu là Chưa thêm vào CSDL:', this.statusZeroCount);
      },
      error => {
        console.error('Error loading Benh data: ', error);
      }
    )
  }

  themBenhMoi() {
    this.themBenh = true;
    this.themLuat = false;
    this.addNewTC = false;
    this.showBenhAndTC = false;
    this.showTrieuChung = true;
    this.dataService.getnewbenh().subscribe(
      response => {
        console.log(response);
        this.benhs = response;


      },
      error => {
        console.error('Error loading Benh data: ', error);
      }
    )
    // this.dataService.gettrieuchungcu().subscribe(
    //   response => {
    //     console.log(response);
    //     this.trieuchung = response;
    //   },
    //   error => {
    //     console.error('Error loading users data: ', error);
    //   }
    // )

  }
  selectBenh(benh: any) {
    this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn
    console.log(benh)
    // Chuyển đổi giá trị ma_benh thành số nguyên
    const maBenh = parseInt(benh.ma_benh_moi, 10);
    // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn

    this.dataService.getTrieuChungByMaBenhMoi(benh.ma_benh_moi, this.authService.getID()).subscribe(
      (trieuChung: any[]) => {
        this.selectedBenh1 = true;
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.listTrieuChung = trieuChung;
        this.trieuChungTraVe = trieuChung;
        // Gửi selectedTrieuChung đến API CheckTc
        this.sendSelectedTrieuChungToAPI();
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );

  }
  sendSelectedTrieuChungToAPI() {
    console.log(this.authService.getID())


    // Gọi API CheckTc và gửi danh sách triệu chứng đã chọn
    this.dataService.checkTrieuChung(this.authService.getID(), this.trieuChungTraVe).subscribe(
      (response: any) => {
        // Xử lý response từ API nếu cần
        console.log('Response from CheckTc API:', response);
        this.check = response.message;
        console.log(this.check);
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error sending selected trieu chung to API:', error);
      }
    );
  }
  // Thêm vào class TaskbarKsComponent
  // Trong hàm showNewBenhDetails
  showNewBenhDetails() {
    // this.selectedBenh12 = true;
    // this.showTrieuChung = true;

    if (this.selectedBenh) {
      this.showAddNewButton = this.selectedBenh.ghi_chu === 'Chưa thêm vào CSDL';
      this.selectedBenh12 = true;
      this.showTrieuChung = true;
      const newBenh = {
        trieuChung: [] // Thêm triệu chứng vào đây nếu có
      };
      this.newBenh = newBenh;
      this.selectedTrieuChung = []; // Khởi tạo mảng chứa các triệu chứng đã chọn
      this.selectedTenBenh = ''; // Đặt lại giá trị của tên bệnh đã chọn
    }

  }

  selectTrieuChung(benh: any) {
    if (!benh.isClicked) {
      if (this.newBenh) {
        if (!this.selectedTenBenh) {
          this.selectedTenBenh = this.selectedBenh?.ten_benh_moi || '';
        }


        // Thêm tenTrieuChung vào selectedTrieuChung nếu check[i] là null
        this.selectedTrieuChung.push({
          tenBenh: this.selectedTenBenh,
          tenTrieuChung: benh[1]
        });
        if (this.check[this.listTrieuChung.indexOf(benh)] != null) {
          // Thêm giá trị của check[i] vào mảng khác nếu check[i] không phải là null
          // Thay 'selected' bằng tên mảng bạn muốn lưu giá trị nếu chúng không phải là null
          this.selectedMaTC.push(this.check[this.listTrieuChung.indexOf(benh)]);
        }
      }
      console.log(this.selectedTrieuChung);
      console.log(this.selectedMaTC);
      benh.isClicked = true; // Đánh dấu triệu chứng đã được chọn
    }
  }

  selectBenh1(benh: any) {
    this.ma_benh_moi = benh.ma_benh_moi; // Lưu ID của bệnh được chọn
    this.ma_benh_suggest = benh.ma_benh_suggest;

    // Các thao tác khác nếu cần
  }
  saveruletype1() {
    const MaArray = this.trieuchungaddrule.map((trieuchung: any[]) => trieuchung[0]);
    console.log(MaArray)
    this.dataService.saveruletype1(this.authService.getID(), 1, this.selectBenhaddrule.ma_benh, MaArray).subscribe(
      response => {
        console.log(response);
        this.saverule1 = true;
        this.messageaddrule1 = 'Thêm luật loại 1 thành công'
        this.ma_tc = response.nonNullMatchingBenhIdsList;
        console.log(this.ma_tc);

      }
    ),
      (error: HttpErrorResponse) => {
        console.error('Error loading data: ', error);
      }

  }
  saveruletype3() {
    this.dataService.saveruletype3(this.authService.getID(), 3, this.selectBenhaddrule.ma_benh, this.ma_tc).subscribe(
      response => {
        console.log(response);
        this.saverule3 = true;
        this.messageaddrule3 = 'Thêm luật loại 3 thành công'


      }
    ),
      (error: HttpErrorResponse) => {
        console.error('Error loading data: ', error);
      }
  }

  SaveNewBenh(benh: any) {
    const trieuChungList = this.selectedTrieuChung.map((item) => ({
      trieu_chung: item.tenTrieuChung
    }));
    const MaList = this.selectedMaTC;
    console.log(MaList)
    const ghi_chu = "Đã lưu vào CSDL";
    // this.ghi_chu_sau_khi_sua = this.benhs.map(benh => benh.ghi_chu as string);



    if (benh.ghi_chu.includes("Chưa thêm vào CSDL")) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '550px',
        data: { message: 'Thông báo! Bạn có chắc chắn muốn lưu Bệnh mới?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveBenh(trieuChungList, MaList, ghi_chu);
        }
      });
    } else {
      this.dialog.open(ConfirmComponent, {
        width: '550px',
        data: {
          title: "Thông báo: Lỗi",
          message: 'Bệnh đã được thêm vào CS Tri thức rồi',
          okButton: true
        }
      });
    }
  }

  saveBenh(trieuChungList: any, MaList: any, ghi_chu: string) {
    console.log(MaList)
    this.dataService
      .SaveNewBenh(
        this.authService.getID(),
        this.selectedTenBenh,
        this.selectedBenh.loai_he,
        trieuChungList,
        MaList,
        ghi_chu
      )
      .subscribe(
        (response: any) => {
          this.dialog.open(ConfirmComponent, {
            width: '550px',
            data: {
              title: "Thông báo",
              message: 'Thêm Bệnh Thành công',
              okButton: true
            }
          });
          console.log(response)
          this.themBenhMoi();
          this.showAddNewButton = false;
        },
        (error: HttpErrorResponse) => {
          this.dialog.open(ConfirmComponent, {
            width: '550px',
            data: {
              title: "Thông báo",
              message: 'Thêm Bệnh Không Thành công',
              okButton: true
            }
          });
          this.themBenhMoi();
        }
      );
  }

  getBenhList() {
    this.dataService.getnewbenh().subscribe(
      response => {
        console.log(response);
        this.benhs = response;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    )
  }
  themLuat123(benh: any) {
    // Thực hiện thêm luật với mã bệnh được chọn (maBenh)
    // Gọi API hoặc xử lý tương ứng ở đây
    this.addrule = true;
    this.addNewTC = false;
    this.selectBenhaddrule = benh;
    this.getTC(this.selectBenhaddrule);



  }

  // Phương thức này được gọi sau khi nhận được dữ liệu từ API
  xuLyDuLieuTuAPI(dataFromAPI: any[]) {
    // Lặp qua dữ liệu từ API và so sánh với dữ liệu có sẵn trong bảng
    this.benhss.forEach((benh) => {
      const matchingData = dataFromAPI.find((item) => item.ma_benh == benh.ma_benh);
      console.log("matching" + matchingData)
      // Nếu tìm thấy mã bệnh tương ứng
      if (matchingData) {
        // Kiểm tra và gán giá trị Trạng thái (đã có luật hay chưa)
        benh.da_co_luat = false; // hoặc false tùy thuộc vào dữ liệu từ API

        // Nếu muốn lấy thông tin khác từ API gán vào benh (ví dụ: thông tin luật)
        // benh.thong_tin_luat = matchingData.thong_tin_luat;
      } else {
        // Nếu không tìm thấy mã bệnh, mặc định là chưa có luật
        benh.da_co_luat = true;
      }
    });
  }

  getTC(benh: any) {
    this.dataService.getTrieuChungByMaBenh(benh.ma_benh).subscribe(
      (trieuChung: any[]) => {
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.trieuchungaddrule = trieuChung;

      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );


  }
  // phần thêm triệu chứng mới cho bệnh cũ
  addNewTCIntoBenh() {
    this.addNewTC = true;
    this.themBenh = false;
    this.themLuat = false;
    this.showBenhAndTC = false;
    this.getBenhOfTrieuChungMoi();
  }
  // hàm thông báo thêm triệu chứng vào bệnh
  notification() {
    this.dataService.getBenhOfTrieuChungMoi().subscribe(
      response => {
        //console.log(response);
        this.benhDaco = response;
        this.statusZeroCount1 = this.benhDaco.filter(item => item.trang_thai === 0).length;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    )
  }
  getBenhOfTrieuChungMoi() {
    this.dataService.getBenhOfTrieuChungMoi().subscribe(
      response => {
        console.log(response);
        this.benhDaco = response;
      },
      error => {
        console.error('Error loading users data: ', error);
      }
    )

  }
  selectBenh2(benh: any) {
    this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn
    console.log(benh)
    // Chuyển đổi giá trị ma_benh thành số nguyên
    const maBenh = parseInt(benh.ma_benh_suggest, 10);
    // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn

    this.dataService.getTrieuChungSuggestByMaBenhMoi(maBenh, this.authService.getID()).subscribe(
      (trieuChung: any[]) => {
        this.selectedBenh1 = true;
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.listTrieuChung = trieuChung;
        this.trieuChungTraVe = trieuChung;
        // Gửi selectedTrieuChung đến API CheckTc
        this.sendSelectedTrieuChungToAPI();
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );

  }
  selectTrieuChungSuggestMoi(benh: any) {
    if (!benh.isClicked) {
      if (this.newBenh) {
        if (!this.selectedTenBenh) {
          this.selectedTenBenh = this.selectedBenh?.ten_benh_suggest || '';
        }


        // Thêm tenTrieuChung vào selectedTrieuChung nếu check[i] là null
        this.selectedTrieuChung.push({
          tenBenh: this.selectedTenBenh,
          tenTrieuChung: benh[1]
        });
        if (this.check[this.listTrieuChung.indexOf(benh)] != null) {
          // Thêm giá trị của check[i] vào mảng khác nếu check[i] không phải là null
          // Thay 'selected' bằng tên mảng bạn muốn lưu giá trị nếu chúng không phải là null
          this.selectedMaTC.push(this.check[this.listTrieuChung.indexOf(benh)]);
        }
      }
      console.log(this.selectedTrieuChung);
      console.log(this.selectedMaTC);
      benh.isClicked = true; // Đánh dấu triệu chứng đã được chọn
    }
  }
  saveTrieuChungBenh(benh: any) {
    //console.log("ma Benh " + benh.ma_benh_trong_bang_benh);
    const ma_benh = benh.ma_benh_trong_bang_benh;
    const ma_benh_suggest = benh.ma_benh_suggest;
    // Lấy danh sách tên triệu chứng từ selectedTrieuChung và hiển thị trong console.log
    // chuyển thành dạng map<strong,object>
    const trieuChungList = this.selectedTrieuChung.map((item) => ({ tenTrieuChung: item.tenTrieuChung }));
    //console.log("Danh sách tên triệu chứng:");
    console.log(trieuChungList);

    // Lấy danh sách mã triệu chứng từ selectedMaTC và hiển thị trong console.log
    const MaList = this.selectedMaTC;
    //console.log("Danh sách mã triệu chứng:");
    console.log(MaList);
    const trang_thai = 1;// trạng thái =1 sẽ cho vào bảng bénhuggest là để thông báo rằng triệu trứng đã được thêm
    this.dataService.saveTrieuChungSuggest(trieuChungList, ma_benh, trang_thai, ma_benh_suggest).subscribe(
      (response: any) => {
        if (response.message) {
          this.message = 'Thêm thành công triệu chứng mới vào bệnh và luật mới';
          // Xử lý khi thêm thành công
          console.log('Thêm thành công');
          // Nếu bạn muốn sử dụng thông tin từ trieuChungMap
          if (response.trieuChungMap) {
            // Thực hiện xử lý với trieuChungMap ở đây// đây là chuỗi json báo triệu chứng nào đã có và chưa có trong csdl trước khi lưu để vào bước thêm luật
            console.log("trieu chung map: " + response.trieuChungMap);

            let jsonString: string = response.trieuChungMap;
            // Chuyển đổi chuỗi JSON thành đối tượng TypeScript
            let jsonObject: any = JSON.parse(jsonString);

            let existedInDatabase: number[] = [];
            let notExistInDatabase: number[] = [];

            // Lặp qua các cặp key-value trong đối tượng JSON
            for (let key in jsonObject) {
              if (jsonObject.hasOwnProperty(key)) {
                let value: number = jsonObject[key];
                if (key.startsWith('TC đã có trong csdl')) {
                  existedInDatabase.push(value);
                } else if (key.startsWith('Chưa có trong csdl')) {
                  notExistInDatabase.push(value);
                }
              }
            }
            console.log("Mảng giá trị của 'TC đã có trong csdl':", existedInDatabase);
            console.log("Mảng giá trị của 'Chưa có trong csdl':", notExistInDatabase);
            this.dataService.saveLuatTrieuChungSuggest(this.authService.getID(), ma_benh, existedInDatabase, notExistInDatabase).subscribe(
              (response: any) => {

              },
              (error) => {
                this.message = 'Lỗi server';
                // Xử lý khi có lỗi từ phía client hoặc server
                console.error('Error fetching trieu chung:', error);
              }
            );

          }
        } else if (response.error) {
          this.message = 'Thêm thất bại';
          // Xử lý khi thêm thất bại
          console.error(response.error);
        }

      },
      (error) => {
        this.message = 'Lỗi server';
        // Xử lý khi có lỗi từ phía client hoặc server
        console.error('Error fetching trieu chung:', error);
      }
    );
  }
  // chức năng xem bệnh trong cs tri thức
  watchBenhInCSTT() {
    this.showBenhAndTC = true;
    this.addNewTC = false;
    this.themBenh = false;
    this.themLuat = false;
  }
  onCheckboxChange() {
    // Lọc danh sách bệnh theo loại hệ hô hấp là 1 nếu checkbox được chọn
    if (this.loai_he == '1') {
      this.dataService.getBenhbyhe(1).subscribe(
        data => {
          this.benhs = data;
        },
        error => {
          console.error('Error loading users data: ', error);
        }
      )
    } else if (this.loai_he == '2') {
      this.dataService.getBenhbyhe(2).subscribe(
        data => {
          this.benhs = data;
        },
        error => {
          console.error('Error loading users data: ', error);
        })
    }
    else {
      this.dataService.getBenh().subscribe(
        data => {
          this.benhs = data;

        },
        error => {
          console.error('Error loading users data: ', error);
        }
      )
    }
  }
  selectBenh22(benh: any) {
    this.selectedBenh = benh; // Lưu trữ thông tin bệnh được chọn


    // Chuyển đổi giá trị ma_benh thành số nguyên
    const maBenh = parseInt(benh.ma_benh, 10);
    // Gọi hàm lấy danh sách triệu chứng cho bệnh được chọn
    this.dataService.getTrieuChungByMaBenh(benh.ma_benh).subscribe(
      (trieuChung: any[]) => {
        // Xử lý dữ liệu triệu chứng trả về từ API (trieuChung)
        console.log(trieuChung);
        // Lưu trữ danh sách triệu chứng vào một thuộc tính trong component để hiển thị trong giao diện người dùng
        this.listTrieuChung = trieuChung;
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error('Error fetching trieu chung:', error);

      }
    );

  }
}