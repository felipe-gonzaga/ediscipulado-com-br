import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichaNovoConvertidoEmitirComponent } from './ficha-novo-convertido-emitir/ficha-novo-convertido-emitir.component';
import { FichaNovoConvertidoRoutingModule } from './ficha-novo-convertido-routing.module';



@NgModule({
  declarations: [FichaNovoConvertidoEmitirComponent],
  imports: [
    CommonModule,


    FichaNovoConvertidoRoutingModule,
  ],
})
export class FichaNovoConvertidoModule { }
