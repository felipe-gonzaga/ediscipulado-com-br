import { NbMenuItem } from '@nebular/theme';
import { AuthService } from './../auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menuItens: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,
    },

    {
      title: 'Discipulado',
      icon: 'person-outline',
      children: [
        {
          title: 'Fichas',
          group: true,
        },
        {
          title: 'Novos Decididos',
          link: '/pages/discipulandos',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_DISCIPULANDO'),
        },
        {
          title: 'Discipuladores',
          link: '/pages/discipuladores',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_DISCIPULADOR'),
        },
        {
          title: 'Cadastros',
          group: true,
          hidden: (!this.auth.temPermissao('ROLE_CADASTRAR_EVENTO') && !this.auth.temPermissao('ROLE_CADASTRAR_LOCAL') && !this.auth.temPermissao('ROLE_CADASTRAR_IGREJA')),
        },
        {
          title: 'Eventos',
          link: '/pages/eventos',
          hidden: !this.auth.temPermissao('ROLE_CADASTRAR_EVENTO'),
        },
        {
          title: 'Locais',
          link: '/pages/locais',
          hidden: !this.auth.temPermissao('ROLE_CADASTRAR_LOCAL'),
        },
        {
          title: 'Igrejas',
          link: '/pages/igrejas',
          hidden: !this.auth.temPermissao('ROLE_CADASTRAR_IGREJA'),
        },
      ],
    },
    {
      title: 'E.B.D',
      icon: 'book-open-outline',
      children: [
        {
          title: 'Matrícula',
          link: '/pages/matriculas',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_MATRICULA'),
        },
        {
          title: 'Aula',
          link: '/pages/aulas',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_AULA'),
        },
        {
          title: 'Cadastros',
          group: true,
        },
        {
          title: 'Classes',
          link: '/pages/classes',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_CLASSE'),
        },
        {
          title: 'Conteudo Adicional',
          link: '/pages/conteudo-adicional',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_LICAOADICIONAL'),
        },
      ],
    },
    {
      title: 'Visitas',
      icon: 'home-outline',
      children: [
        {
          title: 'Agendar/Acompanhar Visita',
          link: '/pages/visitas',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_VISITA'),
        },
        {
          title: 'Cadastros',
          group: true,
        },
        {
          title: 'Situação',
          link: '/pages/situacoes',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_SITUACAO'),
        },
        {
          title: 'Motivo',
          link: '/pages/motivos',
          hidden: !this.auth.temPermissao('ROLE_CONSULTAR_MOTIVO'),
        },
      ],
    },
    {
      title: 'Relatórios',
      icon: 'file-text-outline',
      children: [
        {
          title: 'Novos Convertidos',
          link: '/pages/relatorios/novos-convertidos',
        },
        {
          title: 'Ficha de Novo Convertido',
          link: '/pages/relatorios/novos-convertidos/ficha',
        },
      ],
    },
    {
      title: 'Administrador',
      icon: 'settings-outline',
      hidden: !this.auth.temPermissao('ROLE_ADMINISTRADOR'),
      children: [
        {
          title: 'Perfil Usuário',
          link: '/pages/usuario-permissoes',
          hidden: !this.auth.temPermissao('ROLE_ADMINISTRADOR'),
        },
      ],
    },
    {
      title: 'Segurança',
      icon: 'lock-outline',
      children: [
        {
          title: 'Alterar Senha',
          link: '/pages/alterar-senha',
        },
      ],
    },
  ];

  constructor(
    public auth: AuthService,
    ) {

    }

  menu = this.menuItens;





}
