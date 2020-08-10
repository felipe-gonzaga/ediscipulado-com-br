import { Igreja } from './../../../../@core/mock/model';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { CidadesService } from './../../cidades/cidades.service';
import { EstadosService } from './../../estados/estados.service';
import { IgrejasService } from './../igrejas.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'igrejas-cadastro',
  templateUrl: './igrejas-cadastro.component.html',
  styleUrls: ['./igrejas-cadastro.component.scss']
})
export class IgrejasCadastroComponent implements OnInit {

  igreja = new Igreja();
  estados = [];
  cidades = [];
  cidadeSelecionada: number;
  loading = false;

  constructor(
    private igrejasService: IgrejasService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
  ) {}

   ngOnInit() {
    const codigoIgreja = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Igreja');

    this.listarTodosEstados();

    if (codigoIgreja) {
      this.loading = true;
      this.carregarIgreja(codigoIgreja);
    }

  }

   carregarIgreja(codigo: number) {
     this.igrejasService.buscarPorCodigo(codigo)
    .then(reponse => {
      this.loading = false;

      this.igreja = reponse;

      this.cidadeSelecionada = this.igreja.cidade.codigo;
        this.listarCidadesPorEstado();
        this.atualizarTituloEdiao();
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

   listarCidadesPorEstado() {
     this.cidadesService.listarCidadesPorEstado(this.igreja.cidade.estado.codigo)
    .then(cidades => {
      this.cidades = cidades.map(c => ({ name: c.nome, value: c.codigo }));
      this.igreja.cidade.codigo = this.cidadeSelecionada;
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  listarTodosEstados() {
     this.estadosService.listarTodas()
      .then(estados => {
        this.estados = estados.map(e => ({ name: e.nome, value: e.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    this.loading = true;
    if (this.editando) {
      this.atualizarIgreja();
    } else {
      this.adicionarIgreja();
    }
  }

   atualizarIgreja() {
     this.igrejasService.atualizar(this.igreja)
      .then(response => {
        this.loading = false;
        this.igreja = response;

        this.messageService.showToast('Sucesso', 'Igreja alterado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/igrejas']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

   adicionarIgreja() {
    let nuDocumento: string = this.igreja.nuDocumento;

     if (nuDocumento) {
      nuDocumento = nuDocumento.replace('.', '');
      nuDocumento = nuDocumento.replace('.', '');
      nuDocumento = nuDocumento.replace('-', '');
      nuDocumento = nuDocumento.replace('/', '');
     }

     this.igreja.nuDocumento = nuDocumento;

      this.igrejasService.adicionar(this.igreja)
      .then(igrejaAdicionada => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Igreja cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/igrejas']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

   novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.igreja = new Igreja();
    }.bind(this), 1);

    this.router.navigate(['/pages/igrejas/novo']);
  }

   atualizarTituloEdiao() {
     this.title.setTitle(`Edição de Igreja: ${this.igreja.sigla}`);
  }

  // Se existir codigo na igreja é porque é uma edição
  get editando() {
    return this.igreja.codigo;
  }

}
