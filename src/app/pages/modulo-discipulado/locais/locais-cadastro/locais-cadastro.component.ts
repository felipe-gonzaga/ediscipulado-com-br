import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { LocaisService } from './../locais.service';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Local } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'locais-cadastro',
  templateUrl: './locais-cadastro.component.html',
  styleUrls: ['./locais-cadastro.component.scss']
})
export class LocaisCadastroComponent implements OnInit {

  local = new Local();
  igrejas = [];
  loading = false;

  constructor(
    private locaisService: LocaisService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    const codigoLocal = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Local');

    if (codigoLocal) {
      this.loading = true;
      this.carregarLocal(codigoLocal);
    }
    this.carregarIgrejas();
  }

  carregarLocal(codigo: number) {
    this.locaisService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.local = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
        this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
        // Só deixa selecionado o primeiro registro se for uma inclusao
        if (!this.local.igreja.codigo) {
          this.local.igreja.codigo = this.igrejas[0].value;
        }

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.local.igreja.codigo = this.igrejas[0].value;
    }

    this.locaisService.isLocalJaCadastrado(this.local.nome, this.local.tipo, this.local.igreja.codigo)
      .then(response => {
        const resultado = response as boolean;
        if (resultado) {
          this.loading = false;
          this.messageService.showToast('Info', 'O nome do local informado já existe.', this.messageService.types[2]);
        } else {
          this.permiteManterLocal(form);
        }
      });
  }

  permiteManterLocal(form: FormControl) {
    if (this.editando) {
      this.atualizarLocal(form);
    } else {
      this.adicionarLocal(form);
    }
  }

  adicionarLocal(form: FormControl) {
    this.local.ativo = true;
    this.locaisService.adicionar(this.local)
      .then(localAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Local cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/locais']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLocal(form: FormControl) {
    this.local.ativo = true;
    this.locaisService.atualizar(this.local)
    .then(response => {
      this.loading = false;
      this.local = response;

      this.messageService.showToast('Sucesso', 'Local alterado com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/locais']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.local = new Local();
    }.bind(this), 1);

    this.router.navigate(['/pages/locais/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Local: ${this.local.nome}`);
  }

  // Se existir codigo no local é porque é uma edição
  get editando() {
    return this.local.codigo;
  }

}
