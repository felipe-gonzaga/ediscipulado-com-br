import { NgxMaskModule } from 'ngx-mask';
import { PickListModule } from 'primeng/picklist';
import { NbMomentDateModule } from '@nebular/moment';
import { SharedModule } from './../../../@core/shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule, NbDatepickerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { VisitasRoutingModule } from './visitas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitasPesquisaComponent } from './visitas-pesquisa/visitas-pesquisa.component';
import { VisitasCadastroComponent } from './visitas-cadastro/visitas-cadastro.component';
import { VisitasDetalheComponent } from './visitas-detalhe/visitas-detalhe.component';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [VisitasPesquisaComponent, VisitasCadastroComponent, VisitasDetalheComponent],
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
    NbDatepickerModule,
    NbMomentDateModule,

    TableModule,
    TooltipModule,
    CheckboxModule,
    PickListModule,

    NgxMaskModule,

    SharedModule,
    VisitasRoutingModule,
  ],
})
export class VisitasModule { }
