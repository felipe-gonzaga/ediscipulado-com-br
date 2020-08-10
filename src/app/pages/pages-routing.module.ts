import { ConteudoAdicionalModule } from './modulo-ebd/conteudo-adicional/conteudo-adicional.module';
import { AuthGuard } from './../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    /* Rotas do Modulo Discipulando */
    {
      path: 'discipulandos',
      loadChildren: () => import('./modulo-discipulado/discipulandos/discipulandos.module')
        .then(m => m.DiscipulandosModule),
    },
    {
      path: 'discipuladores',
      loadChildren: () => import('./modulo-discipulado/discipuladores/discipuladores.module')
        .then(m => m.DiscipuladoresModule),
    },
    {
      path: 'eventos',
      loadChildren: () => import('./modulo-discipulado/eventos/eventos.module')
        .then(m => m.EventosModule),
    },
    {
      path: 'locais',
      loadChildren: () => import('./modulo-discipulado/locais/locais.module')
        .then(m => m.LocaisModule),
    },
    {
      path: 'igrejas',
      loadChildren: () => import('./modulo-discipulado/igrejas/igrejas.module')
        .then(m => m.IgrejasModule),
    },

    /* Rotas do Modulo EBD */
    {
      path: 'matriculas',
      loadChildren: () => import('./modulo-ebd/matriculas/matriculas.module')
        .then(m => m.MatriculasModule),
    },
    {
      path: 'aulas',
      loadChildren: () => import('./modulo-ebd/aulas/aulas.module')
        .then(m => m.AulasModule),
    },
    {
      path: 'classes',
      loadChildren: () => import('./modulo-ebd/classes/classes.module')
        .then(m => m.ClassesModule),
    },
    {
      path: 'conteudo-adicional',
      loadChildren: () => import('./modulo-ebd/conteudo-adicional/conteudo-adicional.module')
        .then(m => m.ConteudoAdicionalModule),
    },

     /* Rotas do Modulo VISITAS */
     {
      path: 'visitas',
      loadChildren: () => import('./modulo-visitas/visitas/visitas.module')
        .then(m => m.VisitasModule),
    },
    {
      path: 'motivos',
      loadChildren: () => import('./modulo-visitas/motivos/motivos.module')
        .then(m => m.MotivosModule),
    },
    {
      path: 'situacoes',
      loadChildren: () => import('./modulo-visitas/situacoes/situacoes.module')
        .then(m => m.SituacoesModule),
    },

    /* Rotas do Administrador */
    {
      path: 'usuario-permissoes',
      loadChildren: () => import('./modulo-administrador/usuarios/usuarios.module')
        .then(m => m.UsuariosModule),
    },
    {
      path: 'alterar-senha',
      loadChildren: () => import('./modulo-administrador/administrador.module')
        .then(m => m.AdministradorModule),
    },

    /* Rotas do Modulo Relatórios */
    {
      path: 'relatorios/novos-convertidos',
      loadChildren: () => import('./modulo-relatorio/novos-convertidos/novos-convertidos.module')
        .then(m => m.NovosConvertidosModule),
    },
    {
      path: 'relatorios/novos-convertidos/ficha',
      loadChildren: () => import('./modulo-relatorio/ficha-novo-convertido/ficha-novo-convertido.module')
        .then(m => m.FichaNovoConvertidoModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
