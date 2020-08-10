import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { EventosService, EventosFiltro } from './../../eventos/eventos.service';
import { LocaisService, LocaisFiltro } from './../../locais/locais.service';
import { CidadesService } from './../../cidades/cidades.service';
import { EstadosService } from './../../estados/estados.service';
import { Telefone, Discipulando } from './../../../../@core/mock/model';
import { AuthService } from './../../../../auth/auth.service';
import { DiscipulandosService } from './../discipulandos.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'discipulandos-cadastro-simples',
  templateUrl: './discipulandos-cadastro-simples.component.html',
  styleUrls: ['./discipulandos-cadastro-simples.component.scss']
})
export class DiscipulandosCadastroSimplesComponent implements OnInit {
  telefone = new Telefone();
  discipulando = new Discipulando();
  loading = false;
  igrejas = [];
  estados = [];
  cidades = [];
  locaisConversao = [];
  eventos = [];

  constructor(
    private discipulandosService: DiscipulandosService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private locaisService: LocaisService,
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private title: Title,
    private uteis: UteisService,
    ) {

    }

  ngOnInit() {
    const codigoDiscipulando = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Convertido');


    if (codigoDiscipulando) {

      this.loading = true;

      setTimeout(function() {
        this.carregarDiscipulando(codigoDiscipulando);
        // Carrega deixando checked a igreja do usuario logado
        this.discipulando.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
      }.bind(this), 2000);
    }

    this.carregarEstados();
    // Carregamento dos Eventos e Locais esta dentro de 'carregarIgrejas'
    this.carregarIgrejas();
  }

  atualizarLocalConversaoEventoConversao(){
    this.carregarLocaisConversaoPorIgreja(this.discipulando.igreja.codigo);
    this.carregarEventosConversaoPorIgreja(this.discipulando.igreja.codigo);
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(c => ({ name: c.sigla, value: c.codigo }));
         this.discipulando.igreja.codigo = this.igrejas[0].value;

          this.carregarLocaisConversao();
          this.carregarEventosConversao();

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarDiscipulando(codigo: number) {
    this.discipulandosService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.discipulando = response;
          this.listarCidadesPorEstado();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEstados() {
    this.estadosService.listarTodas()
      .then(estados => {
        this.estados = estados.map(e => ({ name: e.nome, value: e.codigo }))
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  listarCidadesPorEstado() {
    this.cidadesService.listarCidadesPorEstado(this.discipulando.endereco.cidade.estado.codigo)
    .then(cidades => {
      if (this.discipulando == null)
        this.discipulando.endereco.cidade.codigo = null;

      this.cidades = cidades.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarLocaisConversao() {
    this.carregarLocaisConversaoPorIgreja(null);
  }

  carregarLocaisConversaoPorIgreja(codigoIgreja: any) {
    const filtro = new LocaisFiltro();
    const arrLocaisConversao = new Array();
    arrLocaisConversao.push('A');
    arrLocaisConversao.push('C');

    filtro.itensPorPagina = 999;
    filtro.tipos = arrLocaisConversao;

    if (codigoIgreja) {
      filtro.codigoIgreja = codigoIgreja;
    }

    filtro.ativo = true;

    this.locaisService.pesquisar(filtro)
    .then(retorno => {
      this.locaisConversao = retorno.locais.map(c => ({ name: c.nome, value: c.codigo }))
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEventosConversao(){
    this.carregarEventosConversaoPorIgreja(null);
  }

  carregarEventosConversaoPorIgreja(codigoIgreja: any) {
    const filtro = new EventosFiltro();

    filtro.itensPorPagina = 999;

    if (codigoIgreja) {
      filtro.codigoIgreja = codigoIgreja;
    }

    filtro.ativo = true;

    this.eventosService.pesquisar(filtro)
    .then(retorno => {
      this.eventos = retorno.eventos.map(e => ({ name: e.nome, value: e.codigo }))
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {

    this.loading = true;

    // Caso só exista um elemento na lista [Não atribui automaticamente]
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.discipulando.igreja.codigo = this.igrejas[0].value;
    }

    this.adicionarDiscipulando(form);

  }

  adicionarDiscipulando(form: FormControl) {
    if (this.discipulando.cpf) {
      this.discipulando.cpf = this.discipulando.cpf.replace('.', '');
      this.discipulando.cpf = this.discipulando.cpf.replace('.', '');
      this.discipulando.cpf = this.discipulando.cpf.replace('-', '');
    }

    this.discipulando.telefones[0] = this.telefone;

    this.discipulandosService.adicionar(this.discipulando)
      .then(discipulandoAdicionado => {

        this.loading = false;

        this.messageService.showToast('Sucesso', 'Discipulando cadastrado com sucesso.', this.messageService.types[1]);

        // form.reset();
        // this.discipulando = new Discipulando();
        this.router.navigate(['pages/discipulandos']);
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.discipulando = new Discipulando();
    }.bind(this), 1);

    this.router.navigate(['pages/discipulandos/novo']);
  }
}
