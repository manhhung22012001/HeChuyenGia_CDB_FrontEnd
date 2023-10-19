import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarQtvComponent } from './taskbar-qtv.component';

describe('TaskbarQtvComponent', () => {
  let component: TaskbarQtvComponent;
  let fixture: ComponentFixture<TaskbarQtvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskbarQtvComponent]
    });
    fixture = TestBed.createComponent(TaskbarQtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
