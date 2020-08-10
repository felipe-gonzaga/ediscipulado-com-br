import { ConfirmationService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { LocaisFiltro, LocaisService } from './../locais.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'locais-pesquisa',
  templateUrl: './locais-pesquisa.component.html',
  styleUrls: ['./locais-pesquisa.component.scss']
})
export class LocaisPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new LocaisFiltro();
  locais = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private locaisService: LocaisService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Locais');
    this.carregarIgrejas();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_LOCAL')) {
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

     this.locaisService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.locais = resultado.locais;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
     const pagina = event.first / event.rows;
     this.pesquisar(pagina);
  }

  excluir(local: any) {
    this.locaisService.excluir(local.codigo)
      .then(() => {
        this.pesquisar();
        this.messageService.showToast('', 'Local excluído com sucesso.', this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(local: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
     accept: () => {
        this.excluir(local);
      },
      /*, reject: */
    });
  }

  alternarStatus(local: any): void {
    const novoStatus = !local.ativo;

    this.locaisService.alternarStatus(local.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        local.ativo = novoStatus;
        this.messageService.showToast('', `Local ${acao} com sucesso!`, this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
   }

  getDescricaoTipoLocal(tipo: string) {
    if (tipo === 'A') {
      return 'Ambos'
    } else if (tipo === 'C') {
      return 'Conversão'
    } else if (tipo === 'B') {
      return 'Batismo';
    } else {
      return '';
    }
  }
}
