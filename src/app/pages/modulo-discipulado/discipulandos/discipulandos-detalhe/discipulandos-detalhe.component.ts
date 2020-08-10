import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { DiscipulandosService } from './../discipulandos.service';
import { Discipulando, Profissao, Escolaridade } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'discipulandos-detalhe',
  templateUrl: './discipulandos-detalhe.component.html',
  styleUrls: ['./discipulandos-detalhe.component.scss']
})
export class DiscipulandosDetalheComponent implements OnInit {

  discipulando = new Discipulando();
  dsSexo: string;
  dsConjuge: string;
  dsRetornandoJesus: string;
  dsPertenceuIgreja: string;
  dsBatizadoImersao: string;
  dsBatizado: string;
  loading = false;

  constructor(
    private discipulandosService: DiscipulandosService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoDiscipulando = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Novo Convertido');

    if (codigoDiscipulando) {
      this.loading = true;
      this.carregarDiscipulando(codigoDiscipulando);
    }
  }

  carregarDiscipulando(codigo: number) {
    this.discipulandosService.buscarPorCodigo(codigo)
      .then(response => {

        this.loading = false;

        this.discipulando = response;

        this.dsSexo = this.discipulando.sexo == 'H' ? 'Homem' : 'Mulher';
        this.dsConjuge = this.discipulando.conjugeEvangelico != null ? (this.discipulando.conjugeEvangelico == 'S' ? 'Sim' : 'Não') : '';
        this.dsRetornandoJesus = this.discipulando.retornandoJesus  != null ? (this.discipulando.retornandoJesus == 'S' ? 'Sim' : 'Não') : '';
        this.dsPertenceuIgreja = this.discipulando.pertenceuIgreja !=null ? (this.discipulando.pertenceuIgreja == 'S' ? 'Sim' : 'Não') : '';
        this.dsBatizado = this.discipulando.batizado != null ? (this.discipulando.batizado == 'S' ? 'Sim' : 'Não') : '';
        this.dsBatizadoImersao = this.discipulando.batizadoImersao != null ? (this.discipulando.batizadoImersao == 'S' ? 'Sim' : 'Não') : '';;

        if (this.discipulando.profissao == null)
          this.discipulando.profissao = new Profissao();
        if (this.discipulando.escolaridade == null)
          this.discipulando.escolaridade = new Escolaridade();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
