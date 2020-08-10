import { FrequenciasService } from './../pages/modulo-ebd/frequencias/frequencias.service';
import { CiclosService } from './../pages/modulo-ebd/ciclos/ciclos.service';
import { AulasService } from './../pages/modulo-ebd/aulas/aulas.service';
import { MatriculasService } from './../pages/modulo-ebd/matriculas/matriculas.service';
import { FichaNovoConvertidoService } from './../pages/modulo-relatorio/ficha-novo-convertido/ficha-novo-convertido.service';
import { NovosConvertidosService } from './../pages/modulo-relatorio/novos-convertidos/novos-convertidos.service';
import { UsuariosService } from '../pages/modulo-administrador/usuarios/usuarios.service';
import { ConteudoAdicionalService } from './../pages/modulo-ebd/conteudo-adicional/conteudo-adicional.service';
import { LicoesService } from './../pages/modulo-ebd/licoes/licoes.service';
import { ClassesService } from './../pages/modulo-ebd/classes/classes.service';
import { LogoutService } from './../auth/logout.service';
import { DiscipuladoresService } from './../pages/modulo-discipulado/discipuladores/discipuladores.service';
import { DiscipulandosService } from './../pages/modulo-discipulado/discipulandos/discipulandos.service';
import { DashboardService } from './../pages/dashboard/dashboard.service';
import { IgrejasService } from './../pages/modulo-discipulado/igrejas/igrejas.service';
import { EventosService } from './../pages/modulo-discipulado/eventos/eventos.service';
import { ErrorHandlerService } from './error-handler.service';
import { MoneyHttp } from './../auth/money-http';
import { AuthModule } from './../auth/auth.module';
import { AuthService } from './../auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService } from './utils';
import { UserData } from './data/users';
import { UserService } from './mock/users.service';
import { MockDataModule } from './mock/mock-data.module';

import { MessageService } from './message.service';
import { UteisService } from './utils/uteis.service';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { JwtHttpInterceptor } from './../auth/jwt-http-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';

// Altera o projeto para o locale=Pt
registerLocaleData(localePt);


const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,

    AuthModule,
    ConfirmDialogModule,
  ],
  exports: [
    AuthModule,
    ConfirmDialogModule,
  ],
  declarations: [

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        /* Servicos do Framework */
        AuthService,
        LogoutService,
        JwtHelperService,
        ErrorHandlerService,
        MoneyHttp,
        MessageService,
        DashboardService,
        UteisService,
        ConfirmationService,
        /* Servicos do Modulo Discipulando */
        DiscipulandosService,
        DiscipuladoresService,
        EventosService,
        IgrejasService,
        /* Servicos do Modulo EBD */
        MatriculasService,
        AulasService,
        FrequenciasService,
        ClassesService,
        LicoesService,
        CiclosService,
        ConteudoAdicionalService,
        /* Serviços do Administrador */
        UsuariosService,
        /* Servicos do Modulo de Relatorios */
        NovosConvertidosService,
        FichaNovoConvertidoService,
      ],
    };
  }
}
