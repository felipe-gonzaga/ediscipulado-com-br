import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { IgrejasService } from './../igrejas.service';
import { Igreja } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'igrejas-detalhe',
  templateUrl: './igrejas-detalhe.component.html',
  styleUrls: ['./igrejas-detalhe.component.scss']
})
export class IgrejasDetalheComponent implements OnInit {

  igreja = new Igreja();

  constructor(
    private igrejasService: IgrejasService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title
  ) { }

  ngOnInit() {
    const codigoIgreja = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Igreja');

    if (codigoIgreja) {
      this.carregarIgreja(codigoIgreja);
    }
  }

  carregarIgreja(codigo: number) {
    this.igrejasService.buscarPorCodigo(codigo)
    .then(reponse => {
        this.igreja = reponse;
      })
    .catch(erro => this.errorHandler.handle(erro));
  }

}
