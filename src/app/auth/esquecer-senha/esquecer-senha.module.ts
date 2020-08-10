import { FormsModule } from '@angular/forms';
import { EsquecerSenhaRoutingModule } from './esquecer-senha-routing.module';
import { EsquecerSenhaComponent } from './../../auth/esquecer-senha/esquecer-senha.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbInputModule, NbButtonModule } from '@nebular/theme';



@NgModule({
  declarations: [EsquecerSenhaComponent],
  imports: [
    CommonModule,
    NbLayoutModule,

    FormsModule,
    NbInputModule,
    NbButtonModule,
    EsquecerSenhaRoutingModule,
  ],
})
export class EsquecerSenhaModule { }
