import { SharedModule } from './../../../@core/shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { SituacoesRoutingModule } from './situacoes-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SituacoesPesquisaComponent } from './situacoes-pesquisa/situacoes-pesquisa.component';
import { SituacoesCadastroComponent } from './situacoes-cadastro/situacoes-cadastro.component';



@NgModule({
  declarations: [SituacoesPesquisaComponent, SituacoesCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    ThemeModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,

    TableModule,
    TooltipModule,

    SharedModule,
    SituacoesRoutingModule,
  ],
})
export class SituacoesModule { }
