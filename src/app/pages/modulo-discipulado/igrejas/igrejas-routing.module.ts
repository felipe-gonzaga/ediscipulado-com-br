import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IgrejasDetalheComponent } from './igrejas-detalhe/igrejas-detalhe.component';
import { IgrejasCadastroComponent } from './igrejas-cadastro/igrejas-cadastro.component';
import { IgrejasPesquisaComponent } from './igrejas-pesquisa/igrejas-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: IgrejasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_IGREJA'] },
    },
    {
      path: 'novo',
      component: IgrejasCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_IGREJA'] },
    },
    {
      path: ':codigo',
      component: IgrejasCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_IGREJA'] },
    },
    {
      path: 'info/:codigo',
      component: IgrejasDetalheComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CONSULTAR_IGREJA'] },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IgrejasRoutingModule { }
