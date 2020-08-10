import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { SituacoesFiltro, SituacoesService } from './../situacoes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'situacoes-pesquisa',
  templateUrl: './situacoes-pesquisa.component.html',
  styleUrls: ['./situacoes-pesquisa.component.scss']
})
export class SituacoesPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new SituacoesFiltro();
  situacoes = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private situacoesService: SituacoesService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Situações');
    this.carregarIgrejas();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_SITUACAO')) {
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

     this.situacoesService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.situacoes = resultado.situacoes;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
 }

 excluir(situacao: any) {
   this.situacoesService.excluir(situacao.codigo)
      .then(() => {
        this.pesquisar();
        this.messageService.showToast('Sucesso', 'Situação excluída com sucesso.', this.messageService.types[1]);
     })
     .catch(erro => this.errorHandler.handle(erro));
 }

 confirmarExclusao(situacao: any) {
   this.confirmation.confirm({
     message: 'Tem certeza que deseja excluir?',
     accept: () => {
       this.excluir(situacao);
     },
     /*reject:*/
   });
 }

 alternarStatus(situacao: any): void {
   const novoStatus = !situacao.ativo;

   this.situacoesService.alternarStatus(situacao.codigo, novoStatus)
     .then(() => {
       const acao = novoStatus ? 'ativada' : 'desativada';

       situacao.ativo = novoStatus;
       this.messageService.showToast('Sucesso', `Situação ${acao} com sucesso!`, this.messageService.types[1]);
     })
     .catch(erro => this.errorHandler.handle(erro));
  }

}
