import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtvCgmanageComponent } from './qtv-cgmanage.component';

describe('QtvCgmanageComponent', () => {
  let component: QtvCgmanageComponent;
  let fixture: ComponentFixture<QtvCgmanageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QtvCgmanageComponent]
    });
    fixture = TestBed.createComponent(QtvCgmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
