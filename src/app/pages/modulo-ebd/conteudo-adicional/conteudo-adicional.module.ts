import { SharedModule } from './../../../@core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { ThemeModule } from './../../../@theme/theme.module';
import { NbCardModule, NbInputModule, NbSelectModule, NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ConteudoAdicionalRoutingModule } from './conteudo-adicional-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConteudoAdicionalPesquisaComponent } from './conteudo-adicional-pesquisa/conteudo-adicional-pesquisa.component';
import { ConteudoAdicionalCadastroComponent } from './conteudo-adicional-cadastro/conteudo-adicional-cadastro.component';
import { ConteudoAdicionalDetalheComponent } from './conteudo-adicional-detalhe/conteudo-adicional-detalhe.component';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [ConteudoAdicionalPesquisaComponent, ConteudoAdicionalCadastroComponent, ConteudoAdicionalDetalheComponent],
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

    SharedModule,

    ConteudoAdicionalRoutingModule,
  ]
})
export class ConteudoAdicionalModule { }
