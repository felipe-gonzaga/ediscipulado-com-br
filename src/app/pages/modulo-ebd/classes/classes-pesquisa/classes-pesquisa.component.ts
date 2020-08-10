import { ConfirmationService } from 'primeng/api';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { AuthService } from './../../../../auth/auth.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ClassesFiltro, ClassesService } from './../classes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'classes-pesquisa',
  templateUrl: './classes-pesquisa.component.html',
  styleUrls: ['./classes-pesquisa.component.scss']
})
export class ClassesPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new ClassesFiltro();
  igrejas = [];
  classes = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private classesService: ClassesService,
    private igrejasService: IgrejasService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Classes');
    this.carregarIgrejas();
  }

  pesquisar(pagina = 0) {
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.codigoIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

     this.classesService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.classes = resultado.classes;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_EVENTO')) {
      return false;
    } else {
      return true;
    }
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  carregarIgrejas() {
  return this.igrejasService.listarPorUsuario()
    .then(igrejas => {
       this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));

       this.filtro.codigoIgreja = this.igrejas[0].value;
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  excluir(classe: any) {
    this.classesService.excluir(classe.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
    }
      this.messageService.showToast('Sucesso' , 'Classe excluída com sucesso', this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(evento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(evento);
      },
      /*reject:*/
    });
  }

  alternarStatus(classe: any): void {
    const novoStatus = !classe.ativo;

    this.classesService.alternarStatus(classe.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        classe.ativo = novoStatus;
        this.messageService.showToast('Sucesso' , `Classe ${acao} com sucesso!`, this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
   }
}
