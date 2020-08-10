import { ProfissoesService } from './../../profissoes/profissoes.service';
import { EscolaridadeService } from './../../escolaridade/escolaridade.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { EventosService, EventosFiltro } from './../../eventos/eventos.service';
import { LocaisService, LocaisFiltro } from './../../locais/locais.service';
import { CidadesService } from './../../cidades/cidades.service';
import { EstadosService } from './../../estados/estados.service';
import { Telefone, Discipulando, Cidade } from './../../../../@core/mock/model';
import { AuthService } from './../../../../auth/auth.service';
import { DiscipulandosService } from './../discipulandos.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'discipulandos-cadastro',
  templateUrl: './discipulandos-cadastro.component.html',
  styleUrls: ['./discipulandos-cadastro.component.scss']
})
export class DiscipulandosCadastroComponent implements OnInit {
  telefone = new Telefone();
  telefoneIndex: number;
  discipulando = new Discipulando();
  telefoneEditando = false;
  loading = false;
  igrejas = [];
  estados = [];
  cidades = [];
  locaisConversao = [];
  locaisBatismo = [];
  eventos = [];
  estadosCivis = [];
  profissoes = [];
  escolaridades = [];

  constructor(
    private discipulandosService: DiscipulandosService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private locaisService: LocaisService,
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private escolaridadeService: EscolaridadeService,
    private profissoesService: ProfissoesService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private title: Title,
    private uteis: UteisService,
    ) {
      this.telefoneIndex = this.discipulando.telefones.length;
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
    this.carregarEstadosCivis();
    // Carregamento dos Eventos e Locais esta dentro de 'carregarIgrejas'
    this.carregarIgrejas();
    this.carregarEscolaridades();
    this.carregarProfissoes();
  }

  atualizarLocalConversaoEventoConversao(){
    this.carregarLocaisConversaoPorIgreja(this.discipulando.igreja.codigo);
    this.carregarLocaisBatismoPorIgreja(this.discipulando.igreja.codigo);
    this.carregarEventosConversaoPorIgreja(this.discipulando.igreja.codigo);
  }

  prepararEdicaoTelefone(telefone: Telefone, index: number) {
    this.telefone = this.clonarTelefone(telefone);
    this.telefoneIndex = index;
    this.telefoneEditando = true;
  }

  adicionarTelefone(formTelefone: FormControl) {
    this.telefoneIndex = this.discipulando.telefones.length;
    // atualiza a lista de telefones
    this.discipulando.telefones[this.telefoneIndex] = this.clonarTelefone(this.telefone);
    // Atualiza o valor do indice
    this.telefoneIndex = this.discipulando.telefones.length;
    // Variavel que exibe botão
    this.telefoneEditando = false;
    // Reinicia os inputs referentes ao telefone
    this.telefone = new Telefone();
    formTelefone.reset();
  }

  atualizarTelefone(formTelefone: FormControl) {
    // atualiza a lista de telefones
    this.discipulando.telefones[this.telefoneIndex] = this.clonarTelefone(this.telefone);
    // Atualiza o valor do indice
    this.telefoneIndex = this.discipulando.telefones.length;
    // Variavel que exibe botão
    this.telefoneEditando = false;
    // Reinicia os inputs referentes ao telefone
    this.telefone = new Telefone();
    formTelefone.reset();
  }

  removerTelefone(index: number) {
    // Remove um telefone
    this.discipulando.telefones.splice(index, 1);
    this.telefoneIndex = this.discipulando.telefones.length;
  }

  clonarTelefone(telefone: Telefone): Telefone {
    return new Telefone(telefone.prefixo, telefone.numero);
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(c => ({ name: c.sigla, value: c.codigo }));
         this.discipulando.igreja.codigo = this.igrejas[0].value;
         // this.discipulando.igreja.codigo = this.igrejas[0].value;
        // if (this.uteis.tamanholista(this.igrejas) === 1) {
          /* this.filtro.codigoIgreja = this.igrejas[0].value; */

        //  this.carregarLocaisConversaoPorIgreja(this.igrejas[0].value);
        //  this.carregarLocaisBatismoPorIgreja(this.igrejas[0].value);
        //  this.carregarEventosConversaoPorIgreja(this.igrejas[0].value);
        //} else {
          this.carregarLocaisConversao();
          this.carregarLocaisBatismo();
          this.carregarEventosConversao();
        //}

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarDiscipulando(codigo: number) {
    this.discipulandosService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.discipulando = response;
          this.listarCidadesPorEstado();
          this.atualizarTituloEdiao();
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

  carregarProfissoes() {
    this.profissoesService.listarTodas()
      .then(profissoes => {
        this.profissoes = profissoes.map(e => ({ name: e.nome, value: e.codigo }))
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEscolaridades() {
    this.escolaridadeService.listarTodas()
      .then(escolaridades => {
        this.escolaridades = escolaridades.map(e => ({ name: e.nome, value: e.codigo }))
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEstadosCivis() {
    this.estadosCivis.push(
    { name: 'Solteiro(a)', value: 'SOLTEIRO' },
    { name: 'Casado(a)', value: 'CASADO' },
    { name: 'Separado(a)', value: 'SEPARADO' },
    { name: 'Divorciado(a)', value: 'DIVORCIADO' },
    { name: 'União Estável', value: 'UNIAO_ESTAVEL' },
    { name: 'Viuvo(a)', value: 'VIUVO' },
    { name: 'Não Informado', value: 'NAO_INFORMADO' });
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

  carregarLocaisBatismo() {
    this.carregarLocaisBatismoPorIgreja(null);
  }
  carregarLocaisBatismoPorIgreja(codigoIgreja: any) {
    const filtro = new LocaisFiltro();
    const arrLocaisBatismo = new Array();
    arrLocaisBatismo.push('A');
    arrLocaisBatismo.push('B');

    if (codigoIgreja) {
      filtro.codigoIgreja = codigoIgreja;
    }

    filtro.ativo = true;

    filtro.itensPorPagina = 999;
    filtro.tipos = arrLocaisBatismo;

    this.locaisService.pesquisar(filtro)
    .then(retorno => {
      this.locaisBatismo = retorno.locais.map(c => ({ name: c.nome, value: c.codigo }))
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

    if (this.editando) {
      this.atualizarDiscipulando(form);
    } else {
      this.adicionarDiscipulando(form);
    }
  }

  adicionarDiscipulando(form: FormControl) {
    if (this.discipulando.cpf) {
      this.discipulando.cpf = this.discipulando.cpf.replace('.', '');
      this.discipulando.cpf = this.discipulando.cpf.replace('.', '');
      this.discipulando.cpf = this.discipulando.cpf.replace('-', '');
    }
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

  atualizarDiscipulando(form: FormControl) {
    this.discipulandosService.atualizar(this.discipulando)
    .then(response => {

      this.loading = false;

      this.discipulando = response;

      this.messageService.showToast('Sucesso', 'Discipulando alterado com sucesso.', this.messageService.types[1]);
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

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Discipulador: ${this.discipulando.nome}`);
  }

  // Se existir codigo no discipulando é porque é uma edição
  get editando() {
    return this.discipulando.codigo;
  }

}
