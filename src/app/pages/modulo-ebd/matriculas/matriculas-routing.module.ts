import { MatriculasDetalheComponent } from './matriculas-detalhe/matriculas-detalhe.component';
import { MatriculasCadastroComponent } from './matriculas-cadastro/matriculas-cadastro.component';
import { MatriculasPesquisaComponent } from './matriculas-pesquisa/matriculas-pesquisa.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: MatriculasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_MATRICULA'] },
  },
  {
    path: 'novo',
    component: MatriculasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MATRICULA'] },
  },
  {
    path: ':codigo',
    component: MatriculasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MATRICULA'] },
  },
  {
    path: 'info/:codigo',
    component: MatriculasDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_MATRICULA'] },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatriculasRoutingModule { }
