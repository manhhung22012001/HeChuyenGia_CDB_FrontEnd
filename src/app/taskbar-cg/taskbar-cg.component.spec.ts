import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarCgComponent } from './taskbar-cg.component';

describe('TaskbarCgComponent', () => {
  let component: TaskbarCgComponent;
  let fixture: ComponentFixture<TaskbarCgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskbarCgComponent]
    });
    fixture = TestBed.createComponent(TaskbarCgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
