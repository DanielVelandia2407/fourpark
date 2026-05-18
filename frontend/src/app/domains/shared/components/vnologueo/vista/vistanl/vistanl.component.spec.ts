import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistanlComponent } from './vistanl.component';

describe('VistanlComponent', () => {
  let component: VistanlComponent;
  let fixture: ComponentFixture<VistanlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistanlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistanlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
