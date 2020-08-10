import { ErrorHandlerService } from './../../@core/error-handler.service';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { UsuariosFiltro } from '../auth.service';
import { Usuario } from '../../@core/mock/model';
import { Router } from '@angular/router';
import { NbComponentStatus } from '@nebular/theme';
import { MessageService } from '../../@core/message.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class NgxLoginComponent implements OnInit {

  user: any = {};
  rememberMe = false;
  submitted: boolean = false;
  status: NbComponentStatus = 'warning';

  constructor(
      private title: Title,
      private service: AuthService,
      private router: Router,
      private errorHandler: ErrorHandlerService,
      private message: MessageService) {

      }

  ngOnInit() {
    this.title.setTitle('Login no e-Discipulado [TESTE]');
  }

  login(): void {

    const validador = this.validarUsuario(this.user.email);

    if (validador) {
      this.service.login(this.user.email, this.user.password)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.errorHandler.handle(error);
      });
    }

    /*this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service. authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });*/
  }

  /**
   * Realiza validações antes de realizar a autenticação
   * 1. Verifica se é um e-mail válido
   * 2. Verifica se o usuário está ativo/inativo
   *
   * @param usuario
   */
  public validarUsuario(usuario: string): boolean {
    const filtro = new UsuariosFiltro();
    filtro.email = usuario;
    let usuarioBD = new Usuario();
    let returnBoolean = true;

    this.service.pesquisarConsultaPublica(filtro)
      .then(response => {
        usuarioBD = response.usuarios[0] as Usuario;


        let config: any;
        config = 'top-right';
        if (response.total === 0) {
          this.message.showToast('', 'O e-mail informado não existe', this.message.types[3]);
          returnBoolean = false;
        } else if (!usuarioBD.ativo) {
          this.message.showToast('', 'O usuário esta inativo.', this.message.types[3]);
          returnBoolean = false;
        }
        returnBoolean = true;
      })
      .catch(error => {
        this.errorHandler.handle(error);
      });
      return returnBoolean;
  }



}
