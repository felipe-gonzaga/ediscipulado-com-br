import { EventosCadastroComponent } from './eventos-cadastro/eventos-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EventosPesquisaComponent } from './eventos-pesquisa/eventos-pesquisa.component';

const routes: Routes = [
  {
  path: '',
  component: EventosPesquisaComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_CONSULTAR_EVENTO'] },
  },
  {
    path: 'novo',
    component: EventosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_EVENTO'] },
  },
  {
    path: ':codigo',
    component: EventosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_EVENTO'] }
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosRoutingModule { }
