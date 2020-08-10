import { ClassesDetalheComponent } from './classes-detalhe/classes-detalhe.component';
import { ClassesCadastroComponent } from './classes-cadastro/classes-cadastro.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { ClassesPesquisaComponent } from './classes-pesquisa/classes-pesquisa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ClassesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_CLASSE'] },
  },
  {
    path: 'novo',
    component: ClassesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CLASSE'] },
  },
  {
    path: ':codigo',
    component: ClassesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CLASSE'] },
  },
  {
    path: 'info/:codigo',
    component: ClassesDetalheComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_CLASSE'] },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassesRoutingModule { }
