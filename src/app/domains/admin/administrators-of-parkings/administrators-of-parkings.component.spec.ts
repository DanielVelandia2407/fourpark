import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsOfParkingsComponent } from './administrators-of-parkings.component';

describe('AdministratorsOfParkingsComponent', () => {
  let component: AdministratorsOfParkingsComponent;
  let fixture: ComponentFixture<AdministratorsOfParkingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorsOfParkingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministratorsOfParkingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
