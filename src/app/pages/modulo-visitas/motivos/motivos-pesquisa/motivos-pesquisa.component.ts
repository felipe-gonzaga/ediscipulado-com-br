import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { MessageService } from './../../../../@core/message.service';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { AuthService } from './../../../../auth/auth.service';
import { MotivosFiltro, MotivosService } from './../motivos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'motivos-pesquisa',
  templateUrl: './motivos-pesquisa.component.html',
  styleUrls: ['./motivos-pesquisa.component.scss']
})
export class MotivosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new MotivosFiltro();
  motivos = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private motivosService: MotivosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Motivos');
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

     this.motivosService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.motivos = resultado.motivos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
 }

 excluir(motivo: any) {
   this.motivosService.excluir(motivo.codigo)
      .then(() => {
        this.pesquisar();
        this.messageService.showToast('Sucesso', 'Motivo excluído com sucesso.', this.messageService.types[1]);
     })
     .catch(erro => this.errorHandler.handle(erro));
 }

 confirmarExclusao(motivo: any) {
   this.confirmation.confirm({
     message: 'Tem certeza que deseja excluir?',
     accept: () => {
       this.excluir(motivo);
     },
     /*reject:*/
   });
 }

 alternarStatus(motivo: any): void {
   const novoStatus = !motivo.ativo;

   this.motivosService.alternarStatus(motivo.codigo, novoStatus)
     .then(() => {
       const acao = novoStatus ? 'ativada' : 'desativada';

       motivo.ativo = novoStatus;
       this.messageService.showToast('Sucesso', `Motivo ${acao} com sucesso!`, this.messageService.types[1]);
     })
     .catch(erro => this.errorHandler.handle(erro));
  }

}
