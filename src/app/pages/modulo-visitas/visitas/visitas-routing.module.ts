import { VisitasDetalheComponent } from './visitas-detalhe/visitas-detalhe.component';
import { VisitasCadastroComponent } from './visitas-cadastro/visitas-cadastro.component';
import { VisitasPesquisaComponent } from './visitas-pesquisa/visitas-pesquisa.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
  path: '',
  component: VisitasPesquisaComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_CONSULTAR_VISITA'] },
  },
  {
    path: 'novo',
    component: VisitasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_VISITA'] },
  },
  {
    path: ':codigo',
    component: VisitasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_VISITA'] },
  },
  {
    path: 'info/:codigo',
    component: VisitasDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_VISITA'] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitasRoutingModule { }
