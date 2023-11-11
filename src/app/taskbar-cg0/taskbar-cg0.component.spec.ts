import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarCg0Component } from './taskbar-cg0.component';

describe('TaskbarCg0Component', () => {
  let component: TaskbarCg0Component;
  let fixture: ComponentFixture<TaskbarCg0Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskbarCg0Component]
    });
    fixture = TestBed.createComponent(TaskbarCg0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
