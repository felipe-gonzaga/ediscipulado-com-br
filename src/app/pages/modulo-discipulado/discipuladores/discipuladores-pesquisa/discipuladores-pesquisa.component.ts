import { ConfirmationService } from 'primeng/api';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { CargosService } from './../../cargos/cargos.service';
import { DiscipuladoresService, DiscipuladoresFiltro } from './../discipuladores.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'discipuladores-pesquisa',
  templateUrl: './discipuladores-pesquisa.component.html',
  styleUrls: ['./discipuladores-pesquisa.component.scss']
})
export class DiscipuladoresPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new DiscipuladoresFiltro();
  igrejas = [];
  cargos = [];
  discipuladores = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private discipuladoresService: DiscipuladoresService,
    private cargosService: CargosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
    ) {
  }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Discipuladores');
    this.carregarCargos();
    this.carregarIgrejas();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_DISCIPULADOR')) {
      return false;
    } else {
      return true;
    }
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
         // Carrega deixando checked a igreja do usuario logado
         this.filtro.codigoIgreja = this.auth.jwtPayload.codigoIgreja;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCargos() {
    return this.cargosService.listarTodas()
      .then(cargos => {
         this.cargos = cargos.map(c => ({ name: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.codigoIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

    this.discipuladoresService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.discipuladores = resultado.discipuladores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(discipulador: any) {
    this.discipuladoresService.excluir(discipulador.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
      }
      this.messageService.showToast('Sucesso', 'Discipulador excluído com sucesso.', this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(discipulador: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(discipulador);
      },
      /*reject: */
    });
  }
}
