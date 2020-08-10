import { MessageService } from './../../../../@core/message.service';
import { ConfirmationService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { ClassesService } from './../../classes/classes.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { MatriculasService } from './../../matriculas/matriculas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasFiltro } from '../matriculas.service';
import { Title } from '@angular/platform-browser';
import { ClassesFiltro } from '../../classes/classes.service';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'matriculas-pesquisa',
  templateUrl: './matriculas-pesquisa.component.html',
  styleUrls: ['./matriculas-pesquisa.component.scss'],
})
export class MatriculasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new MatriculasFiltro();

  classes = [];
  igrejas = [];
  matriculas = [];

  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private matriculasService: MatriculasService,
    private igrejasService: IgrejasService,
    private classesService: ClassesService,
    private errorHandler: ErrorHandlerService,
    private uteis: UteisService,
    public auth: AuthService,
    private title: Title,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
  ) { }

  async ngOnInit() {
    this.title.setTitle('Pesquisa de Matrículas');
    await this.carregarIgrejas();
    this.atualizarClassesPorIgreja();
  }

  pesquisar(pagina = 0) {
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.cdIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

    this.matriculasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.matriculas = resultado.matriculas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  atualizarClassesPorIgreja() {
      const filtro = new ClassesFiltro();
      filtro.codigoIgreja = this.filtro.cdIgreja;
      filtro.itensPorPagina = 999;
      this.classesService.pesquisar(filtro)
      .then(classes => {
        this.classes = classes.classes.map(c => ({ name: c.nome, value: c.codigo }));

        // Caso só tenha 1 item na lista. Deixe checkado
        if (this.uteis.tamanholista(this.classes) === 1) {
          this.filtro.cdClasse = this.classes[0].value;
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  async carregarIgrejas() {
    return await this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
         // Carrega deixando checked a igreja do usuario logado
          this.filtro.cdIgreja = this.auth.jwtPayload.codigoIgreja;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_MATRICULA')) {
      return false;
    } else {
      return true;
    }
  }

  excluir(matricula: any) {
    this.matriculasService.excluir(matricula.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
      }
      this.messageService.showToast('Sucesso', 'Matrícula excluída com sucesso.', this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

confirmarExclusao(matricula: any) {
   this.confirmation.confirm({
    message: 'Tem certeza que deseja excluir?',
   accept: () => {
      this.excluir(matricula);
    },
    /*reject: */
   });
}

}
