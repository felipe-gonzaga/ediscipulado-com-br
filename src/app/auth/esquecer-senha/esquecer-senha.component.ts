import { UsuariosService } from '../../pages/modulo-administrador/usuarios/usuarios.service';
import { ErrorHandlerService } from '../../@core/error-handler.service';
import { MessageService } from '../../@core/message.service';
import { Component, OnInit } from '@angular/core';
import { UsuariosFiltro } from '../auth.service';
import { Usuario } from '../../@core/mock/model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'esquecer-senha',
  templateUrl: './esquecer-senha.component.html',
  styleUrls: ['./esquecer-senha.component.scss']
})
export class EsquecerSenhaComponent implements OnInit {

  constructor(
    private usuarioService: UsuariosService,
    private title: Title,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Esqueci Senha');
  }

  enviar(email: string) {
const validador = this.validarUsuario(email);

    if (validador) {
      this.usuarioService.esqueceuSenha(email)
    .then(() => {
      this.messageService.showToast('Informação', 'Foi enviado um e-mail com uma nova senha.', this.messageService.types[2]);
    });
    }

  }

  /**
   * Realiza validações antes de realizar a autenticação
   * 1. Verifica se é um e-mail válido
   * 2. Verifica se o usuário está ativo/inativo
   *
   * @param usuario
   */
  public validarUsuario(email: string): boolean {
    const filtro = new UsuariosFiltro();
    filtro.email = email;
    let usuarioBD = new Usuario();
    let returnBoolean = true;

    this.usuarioService.pesquisarConsultaPublica(filtro)
      .then(response => {
        usuarioBD = response.usuarios[0] as Usuario;
        if (response.total === 0) {
          this.messageService.showToast('Aviso', 'O e-mail informado não existe.', this.messageService.types[3]);
          returnBoolean = false;
        } else if (!usuarioBD.ativo) {
          this.messageService.showToast('Aviso', 'O usuário esta inativo.', this.messageService.types[3]);
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
