import { ConfirmationService } from 'primeng/api';
import { Igreja } from './../../../../@core/mock/model';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { MessageService } from './../../../../@core/message.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { IgrejasService, IgrejasFiltro } from './../igrejas.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'igrejas-pesquisa',
  templateUrl: './igrejas-pesquisa.component.html',
  styleUrls: ['./igrejas-pesquisa.component.scss']
})
export class IgrejasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new IgrejasFiltro();
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

     this.igrejasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.igrejas = resultado.igrejas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
     const pagina = event.first / event.rows;
     this.pesquisar(pagina);
  }


  confirmarExclusao(igreja: Igreja) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(igreja);
      },
      /*, reject: */
    });
  }

  excluir(igreja: Igreja) {
    this.igrejasService.excluir(igreja.codigo)
    .then(() => {
      if (this.grid.first === 0) {
        this.pesquisar();
      } else {
          this.grid.first = 0;
      }
      this.messageService.showToast('Sucesso', 'Igreja excluído com sucesso.', this.messageService.types[1]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

}
