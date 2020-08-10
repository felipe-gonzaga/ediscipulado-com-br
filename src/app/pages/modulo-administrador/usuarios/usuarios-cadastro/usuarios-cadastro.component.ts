import { UsuariosService } from '../usuarios.service';
import { ErrorHandlerService } from '../../../../@core/error-handler.service';
import { MessageService } from '../../../../@core/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Permissao, Usuario } from '../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.scss']
})
export class UsuariosCadastroComponent implements OnInit {

  usuario = new Usuario();
  permissoes = [];
  permissoesUsuario = [];
  loading = false;

  constructor(
    private usuarioService: UsuariosService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoUsuario = this.route.snapshot.params['codigo'];

    this.title.setTitle('Edição de Usuário');

    if (codigoUsuario) {
      this.loading = true;
      this.carregarUsuario(codigoUsuario);
    }
  }

  carregarUsuario(codigo: number) {
    this.usuarioService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.usuario = response;
        this.listarPermissoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  listarPermissoes() {
    this.usuarioService.listarPermissoes()
    .then(permissoes => {
      this.permissoes = permissoes;
      this.selecionarPermissoesUsuario();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  selecionarPermissoesUsuario() {
    let cont = 0;
    for (let a = 0; a < this.permissoes.length; a++) {
      const permissao = this.permissoes[a].codigo;
      for (let b = 0; b < this.usuario.permissoes.length; b++) {
        const permissaoUsuario = this.usuario.permissoes[b].codigo;
        if (permissao === permissaoUsuario) {
          this.permissoesUsuario[cont] = permissao;
          cont++;
          break;
        }
      }
    }
  }

  salvar() {
    this.loading = true;
    // Atualiza a lista de permissoes de acordo com check selecionado
    this.usuario.permissoes = [];
    const listaPermissoesSelecionadas = new Array<Permissao>();
    let permissaoObjeto = new Permissao();

    for (let a = 0; a < this.permissoesUsuario.length; a++) {
      const permissaoUsuario = this.permissoesUsuario[a];
      permissaoObjeto.codigo = permissaoUsuario;
      listaPermissoesSelecionadas.push(permissaoObjeto);
      permissaoObjeto = new Permissao();
    }

    // Limpa dados da Pessoa
    this.usuario.pessoa = null;

    this.usuario.permissoes = listaPermissoesSelecionadas;
    this.usuarioService.atualizar(this.usuario)
      .then(response => {
        this.loading = false;
        this.usuario = response;
        this.messageService.showToast('Sucesso', 'Permissoes do usuário alterado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/usuario-permissoes/info/', this.usuario.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
