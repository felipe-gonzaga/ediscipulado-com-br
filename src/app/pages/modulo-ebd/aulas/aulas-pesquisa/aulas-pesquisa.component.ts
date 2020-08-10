import { CiclosService } from './../../ciclos/ciclos.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from './../../../../@core/message.service';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { LicoesService } from './../../licoes/licoes.service';
import { ClassesService, ClassesFiltro } from './../../classes/classes.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { AulasFiltro, AulasService } from './../aulas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'aulas-pesquisa',
  templateUrl: './aulas-pesquisa.component.html',
  styleUrls: ['./aulas-pesquisa.component.scss']
})
export class AulasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new AulasFiltro();

  classes = [];
  igrejas = [];
  aulas = [];

  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private aulasService: AulasService,
    private igrejasService: IgrejasService,
    private classesService: ClassesService,
    private licoesService: LicoesService,
    private errorHandler: ErrorHandlerService,
    private uteis: UteisService,
    public auth: AuthService,
    private title: Title,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
  ) { }

  async ngOnInit() {
    this.title.setTitle('Pesquisa de Aulas');
    await this.carregarIgrejas();
    this.atualizarSelectsPorIgreja();
  }

  pesquisar(pagina = 0) {
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.cdIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

    this.aulasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.aulas = resultado.aulas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  atualizarSelectsPorIgreja() {
    // Atualiza as Classes
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

confirmarExclusao(aula: any) {
  this.confirmation.confirm({
   message: 'Tem certeza que deseja excluir?',
  accept: () => {
     this.excluir(aula);
   },
   /*reject: */
  });
}

excluir(aula: any) {
  this.aulasService.excluir(aula.codigo)
    .then(() => {
      if (this.grid.first === 0) {
        this.pesquisar();
    } else {
        this.grid.first = 0;
    }
    this.messageService.showToast('Sucesso', 'Aula excluída com sucesso.', this.messageService.types[1]);
    })
    .catch(erro => this.errorHandler.handle(erro));
}

getHabilitarClick() {
  if (!this.auth.temPermissao('ROLE_CADASTRAR_AULA')) {
    return false;
  } else {
    return true;
  }
}

}
