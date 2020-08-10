import { SharedModule } from './../../../@core/shared/shared.module';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { NbMomentDateModule } from '@nebular/moment';
import { ThemeModule } from './../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { AulasRoutingModule } from './aulas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulasCadastroComponent } from './aulas-cadastro/aulas-cadastro.component';
import { AulasDetalheComponent } from './aulas-detalhe/aulas-detalhe.component';
import { AulasPesquisaComponent } from './aulas-pesquisa/aulas-pesquisa.component';
import { NbSpinnerModule, NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbRadioModule, NbDatepickerModule, NbCheckboxModule } from '@nebular/theme';
import { AulasChamadaComponent } from './aulas-chamada/aulas-chamada.component';
import { CheckboxModule } from 'primeng/checkbox';



@NgModule({
  declarations: [AulasCadastroComponent, AulasDetalheComponent, AulasPesquisaComponent, AulasChamadaComponent],
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,

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
    NbCheckboxModule,

    TableModule,
    TooltipModule,
    PickListModule,

    SharedModule,

    AulasRoutingModule
  ]
})
export class AulasModule { }
