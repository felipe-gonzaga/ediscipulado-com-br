import { PickListModule } from 'primeng/picklist';
import { SharedModule } from './../../../@core/shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NbMomentDateModule } from '@nebular/moment';
import { ThemeModule } from './../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NbCardModule,
         NbSpinnerModule,
         NbInputModule,
         NbSelectModule,
         NbButtonModule,
         NbIconModule,
         NbRadioModule,
         NbDatepickerModule,
         NbCheckboxModule} from '@nebular/theme';
import { MatriculasRoutingModule } from './../matriculas/matriculas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculasPesquisaComponent } from './matriculas-pesquisa/matriculas-pesquisa.component';
import { MatriculasDetalheComponent } from './matriculas-detalhe/matriculas-detalhe.component';
import { MatriculasCadastroComponent } from './matriculas-cadastro/matriculas-cadastro.component';



@NgModule({
  declarations: [MatriculasPesquisaComponent, MatriculasDetalheComponent, MatriculasCadastroComponent],
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
    NbCheckboxModule,

    TableModule,
    RadioButtonModule,
    TooltipModule,
    PickListModule,

    SharedModule,

    MatriculasRoutingModule,
  ],
})
export class MatriculasModule { }
