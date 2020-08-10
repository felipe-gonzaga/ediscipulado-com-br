import { AuthService } from './../../../../auth/auth.service';
import { ResumoLicao } from './../../../../@core/mock/resumo';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { LicoesService } from './../../licoes/licoes.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { ClassesService } from './../classes.service';
import { Licao, Classe } from './../../../../@core/mock/model';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'classes-cadastro',
  templateUrl: './classes-cadastro.component.html',
  styleUrls: ['./classes-cadastro.component.scss']
})
export class ClassesCadastroComponent implements OnInit {

  resumoLicao = new Array<ResumoLicao>();
  resumoLicaoSelecionadas = new Array<ResumoLicao>();
  classe = new Classe();
  igrejas = [];
  loading = false;

  constructor(
    private classesService: ClassesService,
    private igrejasService: IgrejasService,
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
    const codigoClasse = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Evento');

    if (codigoClasse) {
      this.loading = true;
      setTimeout(function() {
        this.carregarClasse(codigoClasse);
        // Carrega deixando checked a igreja do usuario logado
        this.classe.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
      }.bind(this), 2000);
    } else {
      this.carregarLicoes();
    }
    this.carregarIgrejas();

  }

  async carregarLicoes() {
    await this.licoesService.pesquisar().then(resultado => {
      this.resumoLicao = resultado;

      if (this.editando) {
        // Atualiza a Lista de Classes selecionadas
        let resumoLicaoSelec;
        for (const key in this.classe.licoes) {
          if (this.classe.licoes.hasOwnProperty(key)) {
            resumoLicaoSelec = new ResumoLicao();
            let element = this.classe.licoes[key];
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

         this.classe.igreja.codigo = this.igrejas[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  async carregarClasse(codigo: number) {
    await this.classesService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.classe = response;
        this.carregarLicoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.classe = new Classe();
    }.bind(this), 1);

    this.router.navigate(['/pages/classes/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Classe: ${this.classe.nome}`);
  }

  // Se existir codigo no classe é porque é uma edição
  get editando() {
    return this.classe.codigo;
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.classe.igreja.codigo = this.igrejas[0].value;
    }

    this.classesService.isClasseJaCadastrada(this.classe.nome, this.classe.igreja.codigo)
    .then(response => {
      const resultado = response as boolean;
      if (resultado && !this.editando) {
        this.loading = false;
        this.messageService.showToast('Info' , 'O nome da classe informado já existe.', this.messageService.types[2]);
      } else {
        this.permiteManterClasse(form);
      }
    });
  }

  permiteManterClasse(form: FormControl) {
    this.classe.ativo = true;

    let licaoSelec = new Licao();
    this.classe.licoes = new Array<Licao>();
    for (const key in this.resumoLicaoSelecionadas) {
      if (this.resumoLicaoSelecionadas.hasOwnProperty(key)) {
        const element = this.resumoLicaoSelecionadas[key];
        licaoSelec.codigo = element.codigo;
        this.classe.licoes.push(licaoSelec);
        licaoSelec = new Licao();
      }
    }

    if (this.editando) {
      this.atualizarClasse(form);
    } else {
      this.adicionarClasse(form);
    }
  }

  adicionarClasse(form: FormControl) {
    this.classesService.adicionar(this.classe)
      .then(classeAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso' , 'Classe cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/classes']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarClasse(form: FormControl) {
    this.classesService.atualizar(this.classe)
    .then(response => {
      this.loading = false;
      this.classe = response;

      this.messageService.showToast('Sucesso' , 'Classe alterado com sucesso.', this.messageService.types[1]);
      this.atualizarTituloEdiao();
      this.router.navigate(['/pages/classes']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }
}
