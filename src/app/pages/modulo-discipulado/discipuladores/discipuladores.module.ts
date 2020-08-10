import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../../@core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { NbMomentDateModule } from '@nebular/moment';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';
import { DiscipuladoresRoutingModule } from './discipuladores-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscipuladoresCadastroComponent } from './discipuladores-cadastro/discipuladores-cadastro.component';
import { DiscipuladoresDetalheComponent } from './discipuladores-detalhe/discipuladores-detalhe.component';
import { DiscipuladoresPesquisaComponent } from './discipuladores-pesquisa/discipuladores-pesquisa.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [DiscipuladoresCadastroComponent, DiscipuladoresDetalheComponent, DiscipuladoresPesquisaComponent],
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
    NbDatepickerModule,
    NbMomentDateModule,
    NbRadioModule,

    TableModule,
    TooltipModule,

    SharedModule,
    DiscipuladoresRoutingModule,
  ],
})
export class DiscipuladoresModule { }
