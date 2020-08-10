import { SituacoesCadastroComponent } from './situacoes-cadastro/situacoes-cadastro.component';
import { SituacoesPesquisaComponent } from './situacoes-pesquisa/situacoes-pesquisa.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
  path: '',
  component: SituacoesPesquisaComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_CONSULTAR_SITUACAO'] },
  },
  {
    path: 'novo',
    component: SituacoesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_SITUACAO'] },
  },
  {
    path: ':codigo',
    component: SituacoesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_SITUACAO'] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituacoesRoutingModule { }
