import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarFacturasComponent } from './visualizar-facturas.component';

describe('VisualizarFacturasComponent', () => {
  let component: VisualizarFacturasComponent;
  let fixture: ComponentFixture<VisualizarFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarFacturasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
