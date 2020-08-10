import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { DiscipulandosFiltro, DiscipulandosService } from './../../../modulo-discipulado/discipulandos/discipulandos.service';
import { ResumoDiscipulador, ResumoDiscipulando } from './../../../../@core/mock/resumo';
import { DiscipuladoresService, DiscipuladoresFiltro } from './../../../modulo-discipulado/discipuladores/discipuladores.service';
import { FormControl } from '@angular/forms';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { AuthService } from './../../../../auth/auth.service';
import { MotivosService, MotivosFiltro } from './../../motivos/motivos.service';
import { SituacoesService, SituacoesFiltro } from './../../situacoes/situacoes.service';
import { MessageService } from './../../../../@core/message.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { VisitasService } from './../visitas.service';
import { Visita, Discipulador, Discipulando, Situacao, Motivo } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'visitas-cadastro',
  templateUrl: './visitas-cadastro.component.html',
  styleUrls: ['./visitas-cadastro.component.scss']
})
export class VisitasCadastroComponent implements OnInit {
  resumoDiscipuladores = new Array<ResumoDiscipulador>();
  resumoDiscipuladoresSelecionadas = new Array<ResumoDiscipulador>();
  visita = new Visita();
  igrejas = [];
  visitas = [];
  situacoes = [];
  situacoesSelecionados = [];
  motivos = [];
  novosConvertidosSelecionados = [];
  novosConvertidos = [];
  loading = false;

  horasVisita: string = "";

  codigoMotivoTemp: number;

  constructor(
    private visitasService: VisitasService,
    private situacoesService: SituacoesService,
    private discipuladoresService: DiscipuladoresService,
    private discipulandosService: DiscipulandosService,
    private motivosService: MotivosService,
    private igrejasService: IgrejasService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    // Carrega deixando checked a igreja do usuario logado
    this.visita.igreja.codigo = this.auth.jwtPayload.codigoIgreja;

    this.title.setTitle('Edição de Visita');

    this.carregarIgrejas();
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
        this.igrejas = igrejas.map(c => ({ name: c.sigla, value: c.codigo }));
        this.visita.igreja.codigo = this.igrejas[0].value;

        // Carrega os dados da Visita (Caso seja uma alteração)
        const codigoVisita = this.route.snapshot.params['codigo'];
        if (codigoVisita) {
          this.loading = true;
            this.carregarVisita(codigoVisita);
        } else {
          this.carregarDiscipuladores();
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarVisita(codigo: number) {
    this.visitasService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.visita = response;

        this.codigoMotivoTemp = this.visita.motivo.codigo;
        this.visita.motivo = new Motivo();

        if (this.visita.dhVisita)
          this.visita.hora = this.visita.dhVisita.getHours() + ':' + this.visita.dhVisita.getMinutes();

        this.carregarMotivosPorIgreja(this.visita.igreja.codigo);
        this.carregarSituacoesPorIgreja(this.visita.igreja.codigo);
        this.selecionarSituacoes();
        this.carregarDiscipuladores();
        this.carregarDiscipulandos();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarSituacoesPorIgreja(codigoIgreja: number) {
    let filtro = new SituacoesFiltro();
    filtro.ativo = true;

    if (codigoIgreja)
      filtro.codigoIgreja = codigoIgreja;

    filtro.itensPorPagina = 9999;
    this.situacoesService.pesquisar(filtro)
      .then(response => {
        this.situacoes = response.situacoes;
        this.selecionarSituacoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  /**
   *
   */
  selecionarSituacoes() {
    let cont = 0;

    for (let a = 0; a < this.situacoes.length; a++) {
      const situacao = this.situacoes[a].codigo;
      for (let b = 0; b < this.visita.situacoes.length; b++) {
        const situacaoVisita = this.visita.situacoes[b].codigo;
        if (situacao === situacaoVisita) {
          this.situacoesSelecionados[cont] = situacao;
          cont++;
          break;
        }
      }
    }
  }

  carregarMotivosPorIgreja(codigoIgreja: number) {
    let filtro = new MotivosFiltro();
    filtro.ativo = true;
    filtro.codigoIgreja = codigoIgreja;

    this.motivosService.pesquisar(filtro)
      .then(response => {
        this.motivos = response.motivos.map(e => ({ name: e.nome, value: e.codigo }));

        this.visita.motivo.codigo = this.codigoMotivoTemp;
        this.codigoMotivoTemp = null;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarMotivosESituacoes() {
    this.carregarSituacoesPorIgreja(this.visita.igreja.codigo);
    this.carregarMotivosPorIgreja(this.visita.igreja.codigo);
    this.carregarDiscipuladores();
    this.carregarDiscipulandos();
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.visita = new Visita();
      this.resumoDiscipuladores = new Array<ResumoDiscipulador>();
      this.resumoDiscipuladoresSelecionadas = new Array<ResumoDiscipulador>();
      this.novosConvertidosSelecionados = [];
      this.novosConvertidos = [];
      this.situacoesVisitas = [];
    }.bind(this), 1);

    this.router.navigate(['pages/visitas/novo']);
  }

  // Se existir codigo no classe é porque é uma edição
  get editando() {
    return this.visita.codigo;
  }

  async carregarDiscipuladores() {

    let filtro = new DiscipuladoresFiltro();
    filtro.codigoIgreja = this.visita.igreja.codigo;
    filtro.itensPorPagina = 9999;
    await this.discipuladoresService.pesquisar(filtro).then(resultado => {
      this.resumoDiscipuladores = resultado.discipuladores;

      if (this.editando) {
        // Atualiza a Lista de Discipuladores selecionadas
        let resumoDiscipuladoresSelec;
        for (const key in this.visita.discipuladores) {
          if (this.visita.discipuladores.hasOwnProperty(key)) {
            resumoDiscipuladoresSelec = new ResumoDiscipulador();
            let element = this.visita.discipuladores[key];

            resumoDiscipuladoresSelec.codigo = element.codigo;
            resumoDiscipuladoresSelec.nome = element.nome;
            resumoDiscipuladoresSelec.dataNascimento = element.dataNascimento;
            resumoDiscipuladoresSelec.email = element.email;
            resumoDiscipuladoresSelec.sexo = element.sexo;
            resumoDiscipuladoresSelec.dataInicioVigencia = element.dataInicioVigenciaDiscipulador;
            resumoDiscipuladoresSelec.dataFimVigencia = element.dataFimVigenciaDiscipulador;
            resumoDiscipuladoresSelec.cargo = element.cargos[0].nome;
            this.resumoDiscipuladoresSelecionadas.push(resumoDiscipuladoresSelec);
          }
        }

        // Remove os elementos que foram selecionados da lista das discipuladores
        for (const res in this.resumoDiscipuladoresSelecionadas) {
          this.resumoDiscipuladores = this.resumoDiscipuladores.filter(f => !this.uteis.saoIguais(f, this.resumoDiscipuladoresSelecionadas[res]));
        }
      }
    });
  }

 /**
  * Carrega lista com NOVOS CONVERTIDOS
  * @param pagina
  */
  async carregarDiscipulandos(pagina = 0) {
    let filtroDiscipulandos = new DiscipulandosFiltro();
    filtroDiscipulandos.codigoIgreja = this.visita.igreja.codigo;
    filtroDiscipulandos.itensPorPagina = 9999;

    await this.discipulandosService.pesquisar(filtroDiscipulandos).then(resultado => {
      this.novosConvertidos = resultado.discipulandos;

      if (this.editando) {
        // Atualiza a Lista de Novos Convertidos selecionadas
        let novosConvertidosSelec;
        for (const key in this.visita.discipulandos) {
          if (this.visita.discipulandos.hasOwnProperty(key)) {
            novosConvertidosSelec = new ResumoDiscipulando();
            let element = this.visita.discipulandos[key];

            novosConvertidosSelec.codigo = element.codigo;
            novosConvertidosSelec.nome = element.nome;
            novosConvertidosSelec.dataNascimento = element.dataNascimento;
            novosConvertidosSelec.email = element.email;
            novosConvertidosSelec.estadoCivil = element.estadoCivil;
            novosConvertidosSelec.siglaIgrejaDiscipulando = element.localConversao.igreja.sigla;
            novosConvertidosSelec.dataConversao = element.dataConversao;
            novosConvertidosSelec.localConversao = element.localConversao.nome;
            novosConvertidosSelec.eventoConversao = element.eventoConversao.nome;
            this.novosConvertidosSelecionados.push(novosConvertidosSelec);
          }
        }

        // Remove os elementos que foram selecionados da lista das novos convertidos
        for (const res in this.novosConvertidosSelecionados) {
          this.novosConvertidos = this.novosConvertidos.filter(f => !this.uteis.saoIguais(f, this.novosConvertidosSelecionados[res]));
        }
      }
    });
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.visita.igreja.codigo = this.igrejas[0].value;
    }

    /*let dataAtualizada = new Date(this.visita.dhVisita.getFullYear(),
                                  this.visita.dhVisita.getMonth(),
                                  this.visita.dhVisita.getDate(),
                                  Number.parseInt(this.horasVisita.substring(0, 2)),
                                  Number.parseInt(this.horasVisita.substring(2, 6)),
                                  0);*/

    // this.visita.dhVisita = dataAtualizada;
    // this.visita.dhVisita = moment(dataAtualizada, 'YYYY-MM-DD HH:mm:ss').toDate();

    /* Atualiza o objeto de VISITA com a lista de Discipuladores */
    let discipuladoresSelec = new Discipulador();
    this.visita.discipuladores = new Array<Discipulador>();
    for (const key in this.resumoDiscipuladoresSelecionadas) {
      if (this.resumoDiscipuladoresSelecionadas.hasOwnProperty(key)) {
        const element = this.resumoDiscipuladoresSelecionadas[key];
        discipuladoresSelec.codigo = element.codigo;
        this.visita.discipuladores.push(discipuladoresSelec);
        discipuladoresSelec = new Discipulador();
      }
    }

    /* Atualiza o objeto de VISITA com a lista de Novos Convertidos */
    let novosConvertidosSelec = new Discipulando();
    this.visita.discipulandos = new Array<Discipulando>();
    for (const key in this.novosConvertidosSelecionados) {
      if (this.novosConvertidosSelecionados.hasOwnProperty(key)) {
        const element = this.novosConvertidosSelecionados[key];
        novosConvertidosSelec.codigo = element.codigo;
        this.visita.discipulandos.push(novosConvertidosSelec);
        novosConvertidosSelec = new Discipulando();
      }
    }

    /* Atualiza o objeto de SITUACOES com a lista das Situações Selecionadas */
    this.visita.situacoes = [];
    const listaSituacoesSelecionadas = new Array<Situacao>();
    let situacaoObjeto = new Situacao();

    for (let a = 0; a < this.situacoesSelecionados.length; a++) {
      const cdSituacaoSelecionado = this.situacoesSelecionados[a];
      situacaoObjeto.codigo = cdSituacaoSelecionado;
      listaSituacoesSelecionadas.push(situacaoObjeto);
      situacaoObjeto = new Situacao();
    }

    this.visita.situacoes = listaSituacoesSelecionadas;

    if (this.editando) {
      this.atualizarVisita(form);
    } else {
      this.adicionarVisita(form);
    }
  }

  adicionarVisita(form: FormControl) {
    this.visitasService.adicionar(this.visita)
      .then(visitasAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso' , 'Visita cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/visitas']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarVisita(form: FormControl) {
    this.visitasService.atualizar(this.visita)
    .then(response => {
      this.loading = false;
      this.visita = response;

      this.messageService.showToast('Sucesso' , 'Visita alterado com sucesso.', this.messageService.types[1]);
      this.atualizarTituloEdiao();
      this.router.navigate(['/pages/visitas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Visita: ${this.visita.nome}`);
  }

}
