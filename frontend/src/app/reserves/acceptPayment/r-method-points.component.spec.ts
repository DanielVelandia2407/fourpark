import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RMethodPointsComponent } from './r-method-points.component';

describe('RMethodPointsComponent', () => {
  let component: RMethodPointsComponent;
  let fixture: ComponentFixture<RMethodPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RMethodPointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RMethodPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
