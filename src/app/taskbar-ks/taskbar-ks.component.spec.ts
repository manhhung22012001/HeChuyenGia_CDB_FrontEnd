import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarKsComponent } from './taskbar-ks.component';

describe('TaskbarKsComponent', () => {
  let component: TaskbarKsComponent;
  let fixture: ComponentFixture<TaskbarKsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskbarKsComponent]
    });
    fixture = TestBed.createComponent(TaskbarKsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
