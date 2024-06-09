import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTasksComponent } from './view-user-tasks.component';

describe('ViewUserTasksComponent', () => {
  let component: ViewUserTasksComponent;
  let fixture: ComponentFixture<ViewUserTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserTasksComponent]
    });
    fixture = TestBed.createComponent(ViewUserTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
