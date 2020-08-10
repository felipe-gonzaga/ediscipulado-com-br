import { SharedModule } from './../../../@core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from './../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { IgrejasRoutingModule } from './igrejas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbMomentDateModule } from '@nebular/moment';

import { IgrejasPesquisaComponent } from './igrejas-pesquisa/igrejas-pesquisa.component';
import { IgrejasDetalheComponent } from './igrejas-detalhe/igrejas-detalhe.component';
import { IgrejasCadastroComponent } from './igrejas-cadastro/igrejas-cadastro.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [IgrejasPesquisaComponent, IgrejasDetalheComponent, IgrejasCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    ThemeModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbDatepickerModule,
    NbMomentDateModule,

    TableModule,
    TooltipModule,

    SharedModule,

    NbSpinnerModule,

    IgrejasRoutingModule,
  ],
})
export class IgrejasModule { }
