import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosPesquisaComponent } from './eventos-pesquisa/eventos-pesquisa.component';
import { EventosRoutingModule } from './eventos-routing.module';
import { EventosCadastroComponent } from './eventos-cadastro/eventos-cadastro.component';
import { SharedModule } from '../../../@core/shared/shared.module';

@NgModule({
  declarations: [EventosPesquisaComponent, EventosCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    ThemeModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,

    TableModule,
    TooltipModule,

    SharedModule,

    NbSpinnerModule,

    EventosRoutingModule,
  ]
})
export class EventosModule { }
