import { FormControl } from '@angular/forms';
import { DiscipuladoresService, DiscipuladoresFiltro } from './../../../modulo-discipulado/discipuladores/discipuladores.service';
import { AulasService } from './../aulas.service';
import { AuthService } from './../../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { LicoesService } from './../../licoes/licoes.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { ClassesService, ClassesFiltro } from './../../classes/classes.service';
import { Aula, Licao } from './../../../../@core/mock/model';
import { ResumoLicao } from './../../../../@core/mock/resumo';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'aulas-cadastro',
  templateUrl: './aulas-cadastro.component.html',
  styleUrls: ['./aulas-cadastro.component.scss']
})
export class AulasCadastroComponent implements OnInit {

  aula = new Aula();
  resumoLicao = new Array<ResumoLicao>();
  resumoLicaoSelecionadas = new Array<ResumoLicao>();
  igrejas = [];
  classes = [];
  professores = [];
  loading = false;

  constructor(
    private aulasService: AulasService,
    private classesService: ClassesService,
    private igrejasService: IgrejasService,
    private discipuladoresService: DiscipuladoresService,
    private licoesService: LicoesService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    const codigoAula = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Aula');

    this.carregarIgrejas();

    if (codigoAula) {
      this.loading = true;
      setTimeout(function() {
        this.carregarClasse(codigoAula);
        // Carrega deixando checked a igreja do usuario logado
        this.classe.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
      }.bind(this), 2000);
    } else {
      this.carregarClasse();
    }

  }

  async carregarLicoes() {
    await this.licoesService.pesquisar().then(resultado => {
      this.resumoLicao = resultado;

      if (this.editando) {
        // Atualiza a Lista de Classes selecionadas
        let resumoLicaoSelec;
        for (const key in this.aula.classe.licoes) {
          if (this.aula.classe.licoes.hasOwnProperty(key)) {
            resumoLicaoSelec = new ResumoLicao();
            let element = this.aula.classe.licoes[key];
            resumoLicaoSelec.codigo = element.codigo;
            resumoLicaoSelec.nome = element.nome;
            resumoLicaoSelec.numeroLicao = element.numero;
            resumoLicaoSelec.codigoCiclo = element.ciclo.codigo;
            resumoLicaoSelec.nomeCiclo = element.ciclo.nome;
            this.resumoLicaoSelecionadas.push(resumoLicaoSelec);
          }
        }

        // Remove os elementos que foram selecionados da lista das licoes
        for (const res in this.resumoLicaoSelecionadas) {
          this.resumoLicao = this.resumoLicao.filter(f => !this.uteis.saoIguais(f, this.resumoLicaoSelecionadas[res]));
        }
      }
    });
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));

         this.aula.classe.igreja.codigo = this.igrejas[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarProfessores() {
    const filtroProfessores = new DiscipuladoresFiltro();
    const arrCargos = new Array();
    arrCargos.push(1);
    arrCargos.push(2);
    arrCargos.push(3);

    filtroProfessores.cargos = arrCargos;
    filtroProfessores.codigoIgreja = this.aula.classe.igreja.codigo;
    filtroProfessores.itensPorPagina = 999;
    return this.discipuladoresService.pesquisar(filtroProfessores)
      .then(professores => {
         this.professores = professores.discipuladores.map(i => ({ name: i.nome, value: i.codigo }));

         this.aula.professor.codigo = this.professores[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  async carregarClasse() {
    const filtroClasses = new ClassesFiltro();
    filtroClasses.codigoIgreja = this.aula.classe.igreja.codigo;
    filtroClasses.itensPorPagina = 999;
    await this.classesService.pesquisar(filtroClasses)
    .then(classes => {
      this.classes = classes.classes.map(c => ({ name: c.nome, value: c.codigo }));

      // Caso só tenha 1 item na lista. Deixe checkado
      if (this.uteis.tamanholista(this.classes) === 1) {
        this.aula.classe.codigo = this.classes[0].value;
      }

      this.carregarLicoes();
      this.carregarProfessores();
    })
    .catch(erro => this.errorHandler.handle(erro));

  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.aula.classe.igreja.codigo = this.igrejas[0].value;
    }

    this.permiteManterAula(form);
  }

  permiteManterAula(form: FormControl) {

    let licaoSelec = new Licao();
    this.aula.classe.licoes = new Array<Licao>();
    for (const key in this.resumoLicaoSelecionadas) {
      if (this.resumoLicaoSelecionadas.hasOwnProperty(key)) {
        const element = this.resumoLicaoSelecionadas[key];
        licaoSelec.codigo = element.codigo;
        this.aula.licao = (licaoSelec);
        licaoSelec = new Licao();
      }
    }

    if (!this.aula.licaoAdicional.codigo)
      this.aula.licaoAdicional = null;

    if (this.editando) {
      this.atualizarAula(form);
    } else {
      this.adicionarAula(form);
    }
  }

  adicionarAula(form: FormControl) {
    this.aulasService.adicionar(this.aula)
      .then(aulaAlterado => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Aula cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/aulas']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarAula(form: FormControl) {
    this.aulasService.atualizar(this.aula)
    .then(aulaAlterado => {
      this.loading = false;
      this.aula = aulaAlterado;

      this.messageService.showToast('Sucesso', 'Aula alterada com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/aulas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.aula = new Aula();
    }.bind(this), 1);

    this.router.navigate(['/pages/aulas/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de Aula`);
  }

  // Se existir codigo é porque é uma edição
  get editando() {
    return this.aula.codigo;
  }
}
