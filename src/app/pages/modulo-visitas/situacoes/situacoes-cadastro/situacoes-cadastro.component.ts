import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { SituacoesService } from './../situacoes.service';
import { Situacao } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'situacoes-cadastro',
  templateUrl: './situacoes-cadastro.component.html',
  styleUrls: ['./situacoes-cadastro.component.scss']
})
export class SituacoesCadastroComponent implements OnInit {

  situacao = new Situacao();
  igrejas = [];
  loading = false;

  constructor(
    private situacoesService: SituacoesService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    const codigoSituacao = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Situação');

    if (codigoSituacao) {
      this.loading = true;
      this.carregarSituacao(codigoSituacao);
    }
    this.carregarIgrejas();
  }

  carregarSituacao(codigo: number) {
    this.situacoesService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.situacao = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
        this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
        // Só deixa selecionado o primeiro registro se for uma inclusao
        if (!this.situacao.igreja.codigo) {
          this.situacao.igreja.codigo = this.igrejas[0].value;
        }

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.situacao.igreja.codigo = this.igrejas[0].value;
    }

    this.situacoesService.isSituacaoJaCadastrado(this.situacao.descricao, this.situacao.igreja.codigo)
      .then(response => {
        const resultado = response as boolean;
        if (resultado) {
          this.loading = false;
          this.messageService.showToast('Info', 'A descrição da situação informada já existe.', this.messageService.types[2]);
        } else {
          this.permiteManterSituacao(form);
        }
      });
  }

  permiteManterSituacao(form: FormControl) {
    if (this.editando) {
      this.atualizarSituacao(form);
    } else {
      this.adicionarSituacao(form);
    }
  }

  adicionarSituacao(form: FormControl) {
    this.situacao.ativo = true;
    this.situacoesService.adicionar(this.situacao)
      .then(situacaoAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Situacao cadastrada com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/situacoes']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarSituacao(form: FormControl) {
    this.situacao.ativo = true;
    this.situacoesService.atualizar(this.situacao)
    .then(response => {
      this.loading = false;
      this.situacao = response;

      this.messageService.showToast('Sucesso', 'Situação alterada com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/situacoes']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.situacao = new Situacao();
    }.bind(this), 1);

    this.router.navigate(['/pages/situacoes/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Situação: ${this.situacao.descricao}`);
  }

  // Se existir codigo na situacao é porque é uma edição
  get editando() {
    return this.situacao.codigo;
  }

}
