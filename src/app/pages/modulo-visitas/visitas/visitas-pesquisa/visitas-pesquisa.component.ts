import { MotivosService, MotivosFiltro } from './../../motivos/motivos.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { VisitasFiltro, VisitasService } from './../visitas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'visitas-pesquisa',
  templateUrl: './visitas-pesquisa.component.html',
  styleUrls: ['./visitas-pesquisa.component.scss']
})
export class VisitasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new VisitasFiltro();
  visitas = [];
  igrejas = [];
  motivos = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private visitasService: VisitasService,
    private igrejasService: IgrejasService,
    private motivosService: MotivosService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Visitas');
    this.carregarIgrejas();
    this.carregarMotivos();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_VISITA')) {
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

  atualizarMotivos() {
    this.carregarMotivos();
  }

  carregarMotivos() {
    let filtro = new MotivosFiltro();
    filtro.codigoIgreja = this.filtro.codigoIgreja;
    filtro.itensPorPagina = 999;
    return this.motivosService.pesquisar(filtro)
      .then(motivos => {
         this.motivos = motivos.motivos.map(i => ({ name: i.nome, value: i.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {

    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.filtro.codigoIgreja = this.igrejas[0].value;
    }

    this.filtro.pagina = pagina;

     this.visitasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.visitas = resultado.visitas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
 }

 excluir(motivo: any) {
   this.visitasService.excluir(motivo.codigo)
      .then(() => {
        this.pesquisar();
        this.messageService.showToast('Sucesso', 'Visita excluída com sucesso.', this.messageService.types[1]);
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

}
