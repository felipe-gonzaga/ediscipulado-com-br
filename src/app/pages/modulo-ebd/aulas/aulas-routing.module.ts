import { AulasChamadaComponent } from './aulas-chamada/aulas-chamada.component';
import { AulasDetalheComponent } from './aulas-detalhe/aulas-detalhe.component';
import { AulasCadastroComponent } from './aulas-cadastro/aulas-cadastro.component';
import { AulasPesquisaComponent } from './aulas-pesquisa/aulas-pesquisa.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: AulasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_AULA'] },
  },
  {
    path: 'novo',
    component: AulasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_AULA'] },
  },
  {
    path: ':codigo',
    component: AulasChamadaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_AULA'] },
  },
  {
    path: 'info/:codigo',
    component: AulasDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_AULA'] },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AulasRoutingModule { }
