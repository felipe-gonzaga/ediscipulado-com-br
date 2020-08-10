import { TableModule } from 'primeng/table';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ClassesRoutingModule } from './classes-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassesCadastroComponent } from './classes-cadastro/classes-cadastro.component';
import { ClassesDetalheComponent } from './classes-detalhe/classes-detalhe.component';
import { ClassesPesquisaComponent } from './classes-pesquisa/classes-pesquisa.component';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from './../../../@core/shared/shared.module';
import { PickListModule } from 'primeng/picklist';

@NgModule({
  declarations: [ClassesCadastroComponent, ClassesDetalheComponent, ClassesPesquisaComponent],
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

    TableModule,
    TooltipModule,

    PickListModule,

    SharedModule,
    ClassesRoutingModule,
  ],
})
export class ClassesModule { }
