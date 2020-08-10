import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaNovoConvertidoEmitirComponent } from './ficha-novo-convertido-emitir.component';

describe('FichaNovoConvertidoEmitirComponent', () => {
  let component: FichaNovoConvertidoEmitirComponent;
  let fixture: ComponentFixture<FichaNovoConvertidoEmitirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaNovoConvertidoEmitirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaNovoConvertidoEmitirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
