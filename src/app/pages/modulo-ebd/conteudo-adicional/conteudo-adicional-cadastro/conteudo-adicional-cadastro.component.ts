import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { ConteudoAdicionalService } from './../conteudo-adicional.service';
import { LicaoAdicional } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'conteudo-adicional-cadastro',
  templateUrl: './conteudo-adicional-cadastro.component.html',
  styleUrls: ['./conteudo-adicional-cadastro.component.scss']
})
export class ConteudoAdicionalCadastroComponent implements OnInit {

  nomeLicaoAdicional: string;
  licaoAdicional = new LicaoAdicional();
  igrejas = [];
  loading = false;

  constructor(
    private conteudoAdicionalService: ConteudoAdicionalService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
  ) {

  }

  ngOnInit() {
    const codigoLicaoAdicional = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Local');

    if (codigoLicaoAdicional) {
      this.loading = true;
      this.carregarLicaoAdicional(codigoLicaoAdicional);
    }
    this.carregarIgrejas();
  }

  carregarLicaoAdicional(codigo: number) {
    this.conteudoAdicionalService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.licaoAdicional = response;

        this.nomeLicaoAdicional = this.licaoAdicional.nome;

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
        this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
        // Só deixa selecionado o primeiro registro se for uma inclusao
        if (!this.licaoAdicional.igreja.codigo) {
          this.licaoAdicional.igreja.codigo = this.igrejas[0].value;
        }

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.licaoAdicional.igreja.codigo = this.igrejas[0].value;
    }



    this.conteudoAdicionalService.isLicaoAdicionalJaCadastrado(this.licaoAdicional.nome, this.licaoAdicional.igreja.codigo)
      .then(response => {
        const resultado = response as boolean;

        if (resultado && this.nomeLicaoAdicional != this.licaoAdicional.nome) {
          this.loading = false;
          this.messageService.showToast('Info', 'A Lição Adicional informado já existe.', this.messageService.types[2]);
        } else {
          this.permiteManterLicaoAdicional(form);
        }
      });
  }

  permiteManterLicaoAdicional(form: FormControl) {
    if (this.editando) {
      this.atualizarLicaoAdicional(form);
    } else {
      this.adicionarLicaoAdicional(form);
    }
  }

  adicionarLicaoAdicional(form: FormControl) {
    this.licaoAdicional.ativo = true;
    this.conteudoAdicionalService.adicionar(this.licaoAdicional)
      .then(licaoAdicionalAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Lição Adicional cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/conteudo-adicional']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLicaoAdicional(form: FormControl) {
    this.licaoAdicional.ativo = true;
    this.conteudoAdicionalService.atualizar(this.licaoAdicional)
    .then(response => {
      this.loading = false;
      this.licaoAdicional = response;

      this.messageService.showToast('Sucesso', 'Lição Adicional alterado com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/conteudo-adicional']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.licaoAdicional = new LicaoAdicional();
    }.bind(this), 1);

    this.router.navigate(['/pages/conteudo-adicional/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Conteudo Adicional: ${this.licaoAdicional.nome}`);
  }

  // Se existir codigo é porque é uma edição
  get editando() {
    return this.licaoAdicional.codigo;
  }

}
