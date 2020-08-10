import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { DiscipuladoresService } from './../discipuladores.service';
import { Discipulador, Profissao, Escolaridade } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'discipuladores-detalhe',
  templateUrl: './discipuladores-detalhe.component.html',
  styleUrls: ['./discipuladores-detalhe.component.scss']
})
export class DiscipuladoresDetalheComponent implements OnInit {

  discipulador = new Discipulador();
  nomeCargo: string;
  dsSexo: string;
  dsConjuge: string;
  loading = false;

  constructor(
    private discipuladoresService: DiscipuladoresService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title
  ) { }

  ngOnInit() {
    const codigoDiscipulador = this.route.snapshot.params['codigo'];

    this.title.setTitle('Info Discipulador');

    if (codigoDiscipulador) {
      this.loading = true;
      this.carregarDiscipulador(codigoDiscipulador);
    }
  }

  carregarDiscipulador(codigo: number) {
    this.discipuladoresService.buscarPorCodigo(codigo)
    .then(reponse => {
      this.loading = false;
        this.discipulador = reponse;
        this.nomeCargo = this.discipulador.cargos.length >= 1 ? this.discipulador.cargos[0].nome : null;
        this.dsSexo = this.discipulador.sexo == 'H' ? 'Homem' : 'Mulher';
        this.dsConjuge = this.discipulador.conjugeEvangelico != null ? (this.discipulador.conjugeEvangelico == 'S' ? 'Sim' : 'Não') : '';

        if (this.discipulador.profissao == null)
          this.discipulador.profissao = new Profissao();
        if (this.discipulador.escolaridade == null)
          this.discipulador.escolaridade = new Escolaridade();
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

}
