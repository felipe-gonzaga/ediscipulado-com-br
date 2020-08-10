import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MatriculasService } from './../matriculas.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Matricula } from '../../../../@core/mock/model';

@Component({
  selector: 'matriculas-detalhe',
  templateUrl: './matriculas-detalhe.component.html',
  styleUrls: ['./matriculas-detalhe.component.scss']
})
export class MatriculasDetalheComponent implements OnInit {
  loading = false;
  matricula = new Matricula();

  constructor(
    private matriculasService: MatriculasService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoMatricula = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Matrícula');

    if (codigoMatricula) {
      this.loading = true;
      this.carregarMatricula(codigoMatricula);
    }
  }

  carregarMatricula(codigo: number) {
    this.matriculasService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.matricula = response;

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
