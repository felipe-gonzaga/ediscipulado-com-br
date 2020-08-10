import { ConteudoAdicionalService, ConteudosAdicionalsFiltro } from './../conteudo-adicional.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { MessageService } from './../../../../@core/message.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from './../../../../auth/auth.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'conteudo-adicional-pesquisa',
  templateUrl: './conteudo-adicional-pesquisa.component.html',
  styleUrls: ['./conteudo-adicional-pesquisa.component.scss']
})
export class ConteudoAdicionalPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new ConteudosAdicionalsFiltro();
  conteudosAdicionais = [];
  igrejas = [];
  @ViewChild('tabela', {static: false}) grid;

  constructor(
    private conteudosAdicionaisService: ConteudoAdicionalService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Conteudo Adicinal');
    this.carregarIgrejas();
  }

  getHabilitarClick() {
    if (!this.auth.temPermissao('ROLE_CADASTRAR_LICAOADICIONAL')) {
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

     this.conteudosAdicionaisService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.conteudosAdicionais = resultado.conteudosAdicionais;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
     const pagina = event.first / event.rows;
     this.pesquisar(pagina);
  }

  excluir(conteudoAdicional: any) {
    this.conteudosAdicionaisService.excluir(conteudoAdicional.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
      } else {
          this.grid.first = 0;
    }
      this.messageService.showToast('Sucesso', 'Conteudo Adicional excluído com sucesso.', this.messageService.types[1]);
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

  alternarStatus(conteudoAdicional: any): void {
    const novoStatus = !conteudoAdicional.ativo;

    this.conteudosAdicionaisService.alternarStatus(conteudoAdicional.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        conteudoAdicional.ativo = novoStatus;
        this.messageService.showToast('Sucesso', `Conteudo Adicional ${acao} com sucesso!`, this.messageService.types[1]);
      })
      .catch(erro => this.errorHandler.handle(erro));
   }
}
