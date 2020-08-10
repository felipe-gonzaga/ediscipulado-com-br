import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../../@core/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbButtonModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosDetalheComponent } from './usuarios-detalhe/usuarios-detalhe.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [UsuariosCadastroComponent, UsuariosDetalheComponent, UsuariosPesquisaComponent],
  imports: [
    CommonModule,
    FormsModule,

    NbSpinnerModule,

    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbRadioModule,
    SharedModule,

    TableModule,
    TooltipModule,
    CheckboxModule,

    UsuariosRoutingModule,


  ],
})
export class UsuariosModule { }
