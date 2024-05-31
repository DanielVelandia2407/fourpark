import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSuperAdminComponent } from './stats-super-admin.component';

describe('StatsSuperAdminComponent', () => {
  let component: StatsSuperAdminComponent;
  let fixture: ComponentFixture<StatsSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsSuperAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
