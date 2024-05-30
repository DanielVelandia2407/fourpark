import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReserveComponent } from './cancel-reserve.component';

describe('CancelReserveComponent', () => {
  let component: CancelReserveComponent;
  let fixture: ComponentFixture<CancelReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelReserveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
