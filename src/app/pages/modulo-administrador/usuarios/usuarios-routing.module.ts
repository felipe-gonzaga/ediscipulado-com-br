import { UsuariosDetalheComponent } from './usuarios-detalhe/usuarios-detalhe.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { AuthGuard } from '../../../auth/auth.guard';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UsuariosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { role: ['ROLE_ADMINISTRADOR']},
  },
  {
    path: ':codigo',
    component: UsuariosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMINISTRADOR'] },
  },
  {
    path: 'info/:codigo',
    component: UsuariosDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMINISTRADOR'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule { }
