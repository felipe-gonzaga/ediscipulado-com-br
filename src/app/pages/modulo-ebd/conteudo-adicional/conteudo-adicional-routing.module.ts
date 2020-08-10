import { ConteudoAdicionalDetalheComponent } from './conteudo-adicional-detalhe/conteudo-adicional-detalhe.component';
import { ConteudoAdicionalCadastroComponent } from './conteudo-adicional-cadastro/conteudo-adicional-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConteudoAdicionalPesquisaComponent } from './conteudo-adicional-pesquisa/conteudo-adicional-pesquisa.component';


const routes: Routes = [
  {
    path: '',
    component: ConteudoAdicionalPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_LICAOADICIONAL'] },
  },
  {
    path: 'novo',
    component: ConteudoAdicionalCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LICAOADICIONAL'] },
  },
  {
    path: ':codigo',
    component: ConteudoAdicionalCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LICAOADICIONAL'] },
  },
  {
    path: 'info/:codigo',
    component: ConteudoAdicionalDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_LICAOADICIONAL'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConteudoAdicionalRoutingModule { }
