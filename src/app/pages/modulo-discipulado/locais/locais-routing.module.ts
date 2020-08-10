import { LocaisCadastroComponent } from './locais-cadastro/locais-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { LocaisPesquisaComponent } from './locais-pesquisa/locais-pesquisa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LocaisPesquisaComponent,
    canActivate: [AuthGuard],
    data: { role: ['ROLE_CONSULTAR_LOCAL']},
  },
  {
    path: 'novo',
    component: LocaisCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_EVENTO'] },
  },
  {
    path: ':codigo',
    component: LocaisCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_EVENTO'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocaisRoutingModule { }
