import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VnologueoComponent } from './vnologueo.component';

describe('VnologueoComponent', () => {
  let component: VnologueoComponent;
  let fixture: ComponentFixture<VnologueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VnologueoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VnologueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
