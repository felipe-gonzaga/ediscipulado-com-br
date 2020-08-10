import { NovosConvertidosService } from './../novos-convertidos.service';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { EventosService, EventosFiltro } from './../../../modulo-discipulado/eventos/eventos.service';
import { LocaisService, LocaisFiltro } from './../../../modulo-discipulado/locais/locais.service';
import { DiscipulandosFiltro } from './../../../modulo-discipulado/discipulandos/discipulandos.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'novos-convertidos-emitir',
  templateUrl: './novos-convertidos-emitir.component.html',
  styleUrls: ['./novos-convertidos-emitir.component.scss']
})
export class NovosConvertidosEmitirComponent implements OnInit {

  loading = false

  filtro = new DiscipulandosFiltro();
  locais = [];
  eventos = [];
  igrejas = [];

  constructor(
    private novosConvertidosService: NovosConvertidosService,
    private title: Title,
    private locaisService: LocaisService,
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Emitir Relatório de Novos Decididos');
    this.carregarIgrejas();
    this.carregarLocaisConversaoPorIgreja();
    this.carregarEventosConversaoPorIgreja();
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
    let filtro = new LocaisFiltro();
    filtro.codigoIgreja = this.filtro.codigoIgreja;
    filtro.itensPorPagina = 999;
    this.locaisService.pesquisar(filtro)
    .then(locais => {
      this.locais = locais.locais.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEventosConversaoPorIgreja() {
    let filtro = new EventosFiltro();
    filtro.codigoIgreja = this.filtro.codigoIgreja;
    filtro.itensPorPagina = 999;
    this.eventosService.pesquisar(filtro)
    .then(eventos => {
      this.eventos = eventos.eventos.map(c => ({ name: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  emitirRelatorioNovosConvertidos() {
    this.loading = true;

    this.novosConvertidosService.relatorioNovosConvertidos(this.filtro)
      .then(relatorio => {
        this.loading = false;
        const url = window.URL.createObjectURL(relatorio);
        window.open(url);
      });
  }

  atualizarLocalConversaoEventoConversao() {
    this.carregarLocaisConversaoPorIgreja();
    this.carregarEventosConversaoPorIgreja();
  }

}
