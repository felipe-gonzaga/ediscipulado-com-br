import { NbMenuItem } from '@nebular/theme';

/* CÓDIGO MOVIDO PARA pages.component.ts PARA CONSEGUIR REALIZAR VALIDAÇÃO DE PERMISSAO */
export const MENU_ITEMS: NbMenuItem[] = [
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
      },
      {
        title: 'Discipuladores',
        link: '/pages/discipuladores',
      },
      {
        title: 'Cadastros',
        group: true,
      },
      {
        title: 'Eventos',
        link: '/pages/eventos',
      },
      {
        title: 'Locais',
        link: '/pages/locais',
      },
      {
        title: 'Igrejas',
        link: '/pages/igrejas',
      },
    ],
  },
  {
    title: 'E.B.D',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Matrículas',
        link: '/pages/matriculas',
      },
      {
        title: 'Aulas',
      },
      {
        title: 'Cadastros',
        group: true,
      },
      {
        title: 'Classes',
        link: '/pages/classes',
      },
      {
        title: 'Conteudos Adicionais',
        link: '/pages/conteudo-adicional',
      },
    ],
  },
  {
    title: 'Administrador',
    icon: 'settings-outline',
    children: [
      {
        title: 'Perfil Usuário',
        link: '/pages/usuario-permissoes',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
