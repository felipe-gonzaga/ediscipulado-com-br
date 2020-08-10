import { ConfirmationService } from 'primeng/api';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { EventosFiltro } from './../eventos.service';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventosService } from '../eventos.service';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
  selector: 'eventos-pesquisa',
  templateUrl: './eventos-pesquisa.component.html',
  styleUrls: ['./eventos-pesquisa.component.scss']
})
export class EventosPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new EventosFiltro();
  eventos = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Eventos');
    this.carregarIgrejas();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_EVENTO')) {
      return false;
    } else {
      return true;
    }
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));

         this.filtro.codigoIgreja = this.igrejas[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {

    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.codigoIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

     this.eventosService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.eventos = resultado.eventos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
     const pagina = event.first / event.rows;
     this.pesquisar(pagina);
  }

  excluir(evento: any) {
    this.eventosService.excluir(evento.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
    }
      this.messageService.showToast('Sucesso', 'Evento excluído com sucesso.', this.messageService.types[1]);
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

  alternarStatus(evento: any): void {
    const novoStatus = !evento.ativo;

    this.eventosService.alternarStatus(evento.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        evento.ativo = novoStatus;
        this.messageService.showToast('Sucesso', `Evento ${acao} com sucesso!`, this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
   }
}
