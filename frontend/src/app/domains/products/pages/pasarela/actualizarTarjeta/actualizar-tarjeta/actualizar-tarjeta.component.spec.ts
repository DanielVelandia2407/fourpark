import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarTarjetaComponent } from './actualizar-tarjeta.component';

describe('ActualizarTarjetaComponent', () => {
  let component: ActualizarTarjetaComponent;
  let fixture: ComponentFixture<ActualizarTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarTarjetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualizarTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
