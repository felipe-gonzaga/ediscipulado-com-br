import { NbMomentDateModule } from '@nebular/moment';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbRadioModule, NbDatepickerModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NovosConvertidosRoutingModule } from './novos-convertidos-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovosConvertidosEmitirComponent } from './novos-convertidos-emitir/novos-convertidos-emitir.component';



@NgModule({
  declarations: [NovosConvertidosEmitirComponent],
  imports: [
    CommonModule,
    FormsModule,

    NbSpinnerModule,

    NbCardModule,
    ThemeModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbRadioModule,
    NbDatepickerModule,
    NbMomentDateModule,

    NovosConvertidosRoutingModule,
  ],
})
export class NovosConvertidosModule { }
