import { DiscipulandosCadastroSimplesComponent } from './discipulandos-cadastro-simples/discipulandos-cadastro-simples.component';
import { DiscipulandosDetalheComponent } from './discipulandos-detalhe/discipulandos-detalhe.component';
import { DiscipulandosCadastroComponent } from './discipulandos-cadastro/discipulandos-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { DiscipulandosPesquisaComponent } from './discipulandos-pesquisa/discipulandos-pesquisa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DiscipulandosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULANDO'] },
  },
  {
    path: 'novo',
    component: DiscipulandosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DISCIPULANDO'] },
  },
  {
    path: 'novo-simples',
    component: DiscipulandosCadastroSimplesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DISCIPULANDO'] },
  },
  {
    path: ':codigo',
    component: DiscipulandosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DISCIPULANDO'] },
  },
  {
    path: 'info/:codigo',
    component: DiscipulandosDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULANDO'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscipulandosRoutingModule { }
