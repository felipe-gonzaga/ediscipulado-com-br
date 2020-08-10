import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocaisRoutingModule } from './locais-routing.module';
import { LocaisPesquisaComponent } from './locais-pesquisa/locais-pesquisa.component';
import { LocaisCadastroComponent } from './locais-cadastro/locais-cadastro.component';
import { NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbCheckboxModule, NbCardModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../../../@core/shared/shared.module';

@NgModule({
  declarations: [LocaisPesquisaComponent, LocaisCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbCheckboxModule,
    NbRadioModule,

    SharedModule,

    NbSpinnerModule,

    TableModule,
    TooltipModule,
    LocaisRoutingModule,
  ],
})
export class LocaisModule { }
