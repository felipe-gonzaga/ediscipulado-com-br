import { ProfissoesService } from './../../profissoes/profissoes.service';
import { EscolaridadeService } from './../../escolaridade/escolaridade.service';
import { AuthService } from './../../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { CargosService } from './../../cargos/cargos.service';
import { CidadesService } from './../../cidades/cidades.service';
import { EstadosService } from './../../estados/estados.service';
import { DiscipuladoresService } from './../discipuladores.service';
import { Discipulador, Telefone, Cargo } from './../../../../@core/mock/model';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'discipuladores-cadastro',
  templateUrl: './discipuladores-cadastro.component.html',
  styleUrls: ['./discipuladores-cadastro.component.scss']
})
export class DiscipuladoresCadastroComponent implements OnInit {
  telefone = new Telefone();
  telefoneIndex: number;
  telefoneEditando = false;
  discipulador = new Discipulador();
  estados = [];
  cidades = [];
  igrejas = [];
  // Retorno da consulta
  cargos = [];
  // Retorno dos objetos selecionados na tela
  // cargosSelecionados: Cargo[];

  estadosCivis = [];
  profissoes = [];
  escolaridades = [];
  cargoSelecionado: any;
  loading = false;

  constructor(
    private discipuladoresService: DiscipuladoresService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private cargosService: CargosService,
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
    ) { }

  ngOnInit() {
    const codigoDiscipulador = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Discipulador');

    if (codigoDiscipulador) {

      this.loading = true;

      setTimeout(function() {
        this.carregarDiscipulador(codigoDiscipulador);
        // Carrega deixando checked a igreja do usuario logado
        this.discipulador.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
      }.bind(this), 2000);
    }

    this.listarTodosEstados();
    this.listarTodosCargos();
    this.listarTodosEstadosCivis();
    this.carregarIgrejas();
    this.carregarEscolaridades();
    this.carregarProfissoes();
  }

  isRequired(): boolean {
    return this.discipulador.cargos != null && this.discipulador.cargos.length > 0;
  }

  prepararEdicaoTelefone(telefone: Telefone, index: number) {
    this.telefone = this.clonarTelefone(telefone);
    this.telefoneIndex = index;
    this.telefoneEditando = true;
  }

  adicionarTelefone(formTelefone: FormControl) {
    this.telefoneIndex = this.discipulador.telefones.length;
    // atualiza a lista de telefones
    this.discipulador.telefones[this.telefoneIndex] = this.clonarTelefone(this.telefone);
    // Atualiza o valor do indice
    this.telefoneIndex = this.discipulador.telefones.length;
    // Variavel que exibe botão
    this.telefoneEditando = false;
    // Reinicia os inputs referentes ao telefone
    this.telefone = new Telefone();
    formTelefone.reset();
  }

  atualizarTelefone(formTelefone: FormControl) {
    // atualiza a lista de telefones
    this.discipulador.telefones[this.telefoneIndex] = this.clonarTelefone(this.telefone);
    // Atualiza o valor do indice
    this.telefoneIndex = this.discipulador.telefones.length;
    // Variavel que exibe botão
    this.telefoneEditando = false;
    // Reinicia os inputs referentes ao telefone
    this.telefone = new Telefone();
    formTelefone.reset();
  }

  removerTelefone(index: number) {
    // Remove um telefone
    this.discipulador.telefones.splice(index, 1);
    this.telefoneIndex = this.discipulador.telefones.length;
  }

  clonarTelefone(telefone: Telefone): Telefone {
    return new Telefone(telefone.prefixo, telefone.numero);
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(c => ({ name: c.sigla, value: c.codigo }));
         this.discipulador.igreja.codigo = this.igrejas[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarDiscipulador(codigo: number) {
    this.discipuladoresService.buscarPorCodigo(codigo)
    .then(reponse => {

        this.loading = false;

        this.discipulador = reponse;
        this.cargoSelecionado = this.discipulador.cargos.length >= 1 ? this.discipulador.cargos[0].codigo : null;
        this.listarCidadesPorEstado();
        this.atualizarTituloEdiao();
        // this.listarCargosDiscipulador();
       //  this.cargosSelecionados = reponse.cargos;
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

  /*listarCargosDiscipulador() {
    if (this.discipulador.cargos) {
      for (let index = 0; index < this.discipulador.cargos.length; index++) {
        const cargo = this.discipulador.cargos[index] as Cargo;
        this.cargosSelecionados.push(cargo.codigo);
      }
    }
  }*/

  listarTodosEstados() {
    this.estadosService.listarTodas()
      .then(estados => {
        this.estados = estados.map(e => ({ name: e.nome, value: Number.parseInt(e.codigo) }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  listarTodosCargos() {
    this.cargosService.listarTodas()
      .then(cargos => {
        this.cargos = cargos.map(c => ({ name: c.nome, value: c.codigo }));
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

  listarTodosEstadosCivis() {
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
    this.cidadesService.listarCidadesPorEstado(this.discipulador.endereco.cidade.estado.codigo)
    .then(cidades => {
      this.cidades = cidades.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {

    this.loading = true;

    // Caso só exista um elemento na lista [Não atribui automaticamente]
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.discipulador.igreja.codigo = this.igrejas[0].value;
    }

    //Cargo
    let cargo = new Cargo();
    cargo.codigo = this.cargoSelecionado;
    this.discipulador.cargos.push(cargo);

    // Caso existam cargos
   /*if (this.cargosSelecionados) {
      this.discipulador.cargos = new Array<Cargo>();
      let cargo = new Cargo();
      for (let index = 0; index < this.cargosSelecionados.length; index++) {
        cargo.codigo = this.cargosSelecionados[index];
        this.discipulador.cargos.push(cargo);
        cargo = new Cargo();
      }
    }*/

    if (this.editando) {
      this.atualizarDiscipulador();
    } else {
      this.adicionarDiscipulador();
    }
  }

  adicionarDiscipulador() {
    let cpf: string = this.discipulador.cpf;

     if (cpf) {
      cpf = cpf.replace('.', '');
      cpf = cpf.replace('.', '');
      cpf = cpf.replace('-', '');
     }

     this.discipulador.cpf = cpf;

    this.discipuladoresService.adicionar(this.discipulador)
      .then(discipuladorAdicionado => {

        this.loading = false;

        this.messageService.showToast('Sucesso', 'Discipulador cadastrado com sucesso.', this.messageService.types[1]);

        // form.reset();
        // this.discipulador = new Discipulador();
        this.router.navigate(['/pages/discipuladores']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarDiscipulador() {
    this.discipuladoresService.atualizar(this.discipulador)
      .then(response => {
        this.loading = false;

        this.discipulador = response;

        this.messageService.showToast('Sucesso', 'Discipulador alterado com sucesso.', this.messageService.types[1]);
        this.router.navigate(['/pages/discipuladores']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.discipulador = new Discipulador();
    }.bind(this), 1);

    this.router.navigate(['/pages/discipuladores/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Discipulador: ${this.discipulador.nome}`);
  }


  // Se existir codigo no discipulador é porque é uma edição
  get editando() {
    return this.discipulador.codigo;
  }
}
