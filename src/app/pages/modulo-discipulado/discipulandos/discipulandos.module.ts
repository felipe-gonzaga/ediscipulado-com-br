
import { NbMomentDateModule } from '@nebular/moment';
import { SharedModule } from './../../../@core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from './../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { DiscipulandosRoutingModule } from './discipulandos-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscipulandosCadastroComponent } from './discipulandos-cadastro/discipulandos-cadastro.component';
import { DiscipulandosDetalheComponent } from './discipulandos-detalhe/discipulandos-detalhe.component';
import { DiscipulandosPesquisaComponent } from './discipulandos-pesquisa/discipulandos-pesquisa.component';
import { DiscipulandosCadastroSimplesComponent } from './discipulandos-cadastro-simples/discipulandos-cadastro-simples.component';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [DiscipulandosCadastroComponent, DiscipulandosDetalheComponent, DiscipulandosPesquisaComponent, DiscipulandosCadastroSimplesComponent],
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

    TableModule,
    TooltipModule,

    SharedModule,
    DiscipulandosRoutingModule,
  ],
})
export class DiscipulandosModule { }
