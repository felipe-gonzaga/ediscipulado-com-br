import { ErrorHandlerService } from './../../../@core/error-handler.service';
import { MessageService } from './../../../@core/message.service';
import { UsuarioAlterarSenha, UsuariosService } from './../../modulo-administrador/usuarios/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {

  usuarioAlterarSenha = new UsuarioAlterarSenha();

  constructor(
    private usuarioService: UsuariosService,
    private title: Title,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Alterar Senha');
  }

  isSenhasIguais() {
    return (this.usuarioAlterarSenha.novaSenha === this.usuarioAlterarSenha.confirmeSenha);
  }

  alterarSenha() {
    this.usuarioService.alterarSenha(this.usuarioAlterarSenha)
      .then(() => {
        this.messageService.showToast('Sucesso', 'Sua senha foi alterada com sucesso.', this.messageService.types[1]);
      }).catch(erro => this.errorHandler.handle(erro));
  }

}
