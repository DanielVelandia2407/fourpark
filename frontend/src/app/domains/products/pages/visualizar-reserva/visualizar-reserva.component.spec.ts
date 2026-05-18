import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarReservaComponent } from './visualizar-reserva.component';

describe('VisualizarReservaComponent', () => {
  let component: VisualizarReservaComponent;
  let fixture: ComponentFixture<VisualizarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
