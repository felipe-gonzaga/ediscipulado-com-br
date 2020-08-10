import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { LicaoAdicional } from './../../../../@core/mock/model';
import { ConteudoAdicionalService } from './../conteudo-adicional.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'conteudo-adicional-detalhe',
  templateUrl: './conteudo-adicional-detalhe.component.html',
  styleUrls: ['./conteudo-adicional-detalhe.component.scss']
})
export class ConteudoAdicionalDetalheComponent implements OnInit {

  loading = false;
  licaoAdicional = new LicaoAdicional();

  constructor(
    private conteudoAdicionalService: ConteudoAdicionalService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoLicaoAdicional = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento de Lição Adicional');

    if (codigoLicaoAdicional) {
      this.loading = true;
      this.carregarLicaoAdicional(codigoLicaoAdicional);
    }
  }

  carregarLicaoAdicional(codigo: number) {
    this.conteudoAdicionalService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.licaoAdicional = response;

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
