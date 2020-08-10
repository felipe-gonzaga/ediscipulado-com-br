import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { VisitasService } from './../visitas.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Visita } from '../../../../@core/mock/model';

@Component({
  selector: 'visitas-detalhe',
  templateUrl: './visitas-detalhe.component.html',
  styleUrls: ['./visitas-detalhe.component.scss']
})
export class VisitasDetalheComponent implements OnInit {

  visita = new Visita();
  loading = false;

  constructor(
    private visitasService: VisitasService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoVisita = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Visita');

    if (codigoVisita) {
      this.loading = true;
      this.carregarVisita(codigoVisita);
    }
  }

  carregarVisita(codigo: number) {
    this.visitasService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.visita = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
