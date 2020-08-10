import { ThemeModule } from './../../@theme/theme.module';
import { SharedModule } from './../../@core/shared/shared.module';
import { NbCardModule, NbInputModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AlterarSenhaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    NbCardModule,
    ThemeModule,
    NbInputModule,

    NbButtonModule,
    NbIconModule,


    SharedModule,

    AdministradorRoutingModule,
  ],
})
export class AdministradorModule { }
