import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { ClassesService } from './../classes.service';
import { Classe } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'classes-detalhe',
  templateUrl: './classes-detalhe.component.html',
  styleUrls: ['./classes-detalhe.component.scss']
})
export class ClassesDetalheComponent implements OnInit {

  classe = new Classe();
  loading = false;

  constructor(
    private classesService: ClassesService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoClasse = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Classe');

    if (codigoClasse) {
      this.loading = true;
      this.carregarClasse(codigoClasse);
    }
  }

  carregarClasse(codigo: number) {
    this.classesService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.classe = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
