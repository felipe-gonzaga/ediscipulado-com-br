import { RouterModule, Routes } from '@angular/router';
import { DiscipuladoresDetalheComponent } from './discipuladores-detalhe/discipuladores-detalhe.component';
import { DiscipuladoresCadastroComponent } from './discipuladores-cadastro/discipuladores-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { DiscipuladoresPesquisaComponent } from './discipuladores-pesquisa/discipuladores-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: DiscipuladoresPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULADOR'] },
  },
  {
    path: 'novo',
    component: DiscipuladoresCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DISCIPULADOR'] },
  },
  {
    path: ':codigo',
    component: DiscipuladoresCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DISCIPULADOR'] },
  },
  {
    path: 'info/:codigo',
    component: DiscipuladoresDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULADOR'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscipuladoresRoutingModule { }
