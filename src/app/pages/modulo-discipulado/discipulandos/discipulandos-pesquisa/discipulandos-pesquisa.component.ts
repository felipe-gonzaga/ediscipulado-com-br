import { ConfirmationService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { EventosService, EventosFiltro } from './../../eventos/eventos.service';
import { LocaisService, LocaisFiltro } from './../../locais/locais.service';
import { MessageService } from './../../../../@core/message.service';
import { DiscipulandosFiltro, DiscipulandosService } from './../discipulandos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'discipulandos-pesquisa',
  templateUrl: './discipulandos-pesquisa.component.html',
  styleUrls: ['./discipulandos-pesquisa.component.scss'],
})
export class DiscipulandosPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new DiscipulandosFiltro();

  discipulandos = [];
  locais = [];
  eventos = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  async ngOnInit() {
    this.title.setTitle('Pesquisa de Novos Decididos');
    await this.carregarIgrejas();
    this.carregarLocaisConversaoPorIgreja();
    this.carregarEventosConversaoPorIgreja();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_DISCIPULANDO')) {
      return false;
    } else {
      return true;
    }
  }

  constructor(
    private discipulandosService: DiscipulandosService,
    private messageService: MessageService,
    private locaisService: LocaisService,
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
    ) {
  }

  async carregarIgrejas() {
    return await this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
         // Carrega deixando checked a igreja do usuario logado
          this.filtro.codigoIgreja = this.auth.jwtPayload.codigoIgreja;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarLocaisConversaoPorIgreja() {
    const filtro = new LocaisFiltro();
    filtro.codigoIgreja = this.filtro.codigoIgreja;
    filtro.itensPorPagina = 999;
    this.locaisService.pesquisar(filtro)
    .then(locais => {
      this.locais = locais.locais.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEventosConversaoPorIgreja() {
    const filtro = new EventosFiltro();
    filtro.codigoIgreja = this.filtro.codigoIgreja;
    filtro.itensPorPagina = 999;
    this.eventosService.pesquisar(filtro)
    .then(eventos => {
      this.eventos = eventos.eventos.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLocalConversaoEventoConversao() {
    this.carregarLocaisConversaoPorIgreja();
    this.carregarEventosConversaoPorIgreja();
  }

  pesquisar(pagina = 0) {
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.codigoIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

    this.discipulandosService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.discipulandos = resultado.discipulandos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(discipulando: any) {
    this.discipulandosService.excluir(discipulando.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
      }
      this.messageService.showToast('Sucesso', 'Discipulando excluído com sucesso.', this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

confirmarExclusao(discipulandos: any) {
   this.confirmation.confirm({
    message: 'Tem certeza que deseja excluir?',
   accept: () => {
      this.excluir(discipulandos);
    },
    /*reject: */
   });
}

}
