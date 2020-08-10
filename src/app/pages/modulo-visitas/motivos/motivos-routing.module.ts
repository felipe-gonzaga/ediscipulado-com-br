import { MotivosCadastroComponent } from './motivos-cadastro/motivos-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { MotivosPesquisaComponent } from './motivos-pesquisa/motivos-pesquisa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
  path: '',
  component: MotivosPesquisaComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_CONSULTAR_MOTIVO'] },
  },
  {
    path: 'novo',
    component: MotivosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MOTIVO'] },
  },
  {
    path: ':codigo',
    component: MotivosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MOTIVO'] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotivosRoutingModule { }
