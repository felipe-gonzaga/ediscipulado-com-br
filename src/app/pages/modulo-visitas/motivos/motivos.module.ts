import { SharedModule } from './../../../@core/shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { MotivosRoutingModule } from './motivos-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotivosPesquisaComponent } from './motivos-pesquisa/motivos-pesquisa.component';
import { MotivosCadastroComponent } from './motivos-cadastro/motivos-cadastro.component';



@NgModule({
  declarations: [MotivosPesquisaComponent, MotivosCadastroComponent],
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
    MotivosRoutingModule,
  ],
})
export class MotivosModule { }
