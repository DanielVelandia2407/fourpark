import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParkingsComponent } from './admin-parkings.component';

describe('AdminParkingsComponent', () => {
  let component: AdminParkingsComponent;
  let fixture: ComponentFixture<AdminParkingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParkingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminParkingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
