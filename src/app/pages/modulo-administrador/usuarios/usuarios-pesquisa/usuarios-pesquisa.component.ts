import { AuthService, UsuariosFiltro } from '../../../../auth/auth.service';
import { ErrorHandlerService } from '../../../../@core/error-handler.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from '../../../../@core/message.service';
import { UsuariosService } from '../usuarios.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.scss']
})
export class UsuariosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new UsuariosFiltro();
  usuarios = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private usuariosService: UsuariosService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Permissão de Usuários');
  }

  pesquisar(pagina = 0){
    this.filtro.pagina = pagina;

    this.usuariosService.pesquisar(this.filtro)
     .then(resultado => {
       this.totalRegistros = resultado.total;
       this.usuarios = resultado.usuarios;
     })
     .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
 }

 alternarStatus(usuario: any): void {
  const novoStatus = !usuario.ativo;

  this.usuariosService.alternarStatus(usuario.codigo, novoStatus)
    .then(() => {
      const acao = novoStatus ? 'ativada' : 'desativada';

      usuario.ativo = novoStatus;
      this.messageService.showToast('', `Usuário ${acao} com sucesso!`, this.messageService.types[1]);
    })
    .catch(erro => this.errorHandler.handle(erro));
 }

}
