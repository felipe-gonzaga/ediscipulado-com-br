import { FrequenciasService, FrequenciasFiltro, FrequeciaAulasFiltro } from './../../frequencias/frequencias.service';
import { AuthService } from './../../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { MatriculasService } from './../../matriculas/matriculas.service';
import { AulasService } from './../aulas.service';
import { Aula } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { MatriculasFiltro } from '../../matriculas/matriculas.service';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'aulas-detalhe',
  templateUrl: './aulas-detalhe.component.html',
  styleUrls: ['./aulas-detalhe.component.scss']
})
export class AulasDetalheComponent implements OnInit {

  totalRegistros = 0;
  aula = new Aula();
  loading = false;
  dsLicao: String;
  dsAvaliacao: String;
  alunos = [];
  filtroFrequeciaAulas = new FrequeciaAulasFiltro();
  totalPresencas = 0;
  totalFaltas = 0;

  constructor(
    private aulasService: AulasService,
    private frequenciasService: FrequenciasService,
    private matriculasService: MatriculasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    const codigoAula = this.route.snapshot.params['codigo'];

    this.title.setTitle('Detalhamento da Aula');

    if (codigoAula) {
      this.loading = true;
      setTimeout(function() {
        this.carregarAula(codigoAula);
      }.bind(this), 2000);
    } else {
      // Redireciona para pagina de excecao 404
    }

  }

  async carregarAula(codigo: number) {
    await this.aulasService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.aula = response;

        this.dsLicao = this.aula.licao.ciclo.nome + ' - ' + this.aula.licao.nome;
        this.dsAvaliacao = this.aula.avaliacao ? 'Sim' : 'Não';

        this.carregarFrequenciaAlunosMatriculados();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarFrequenciaAlunosMatriculados(pagina = 0) {
    this.filtroFrequeciaAulas.cdAula = this.aula.codigo;

    this.frequenciasService.pesquisaFrequeciaAulas(this.filtroFrequeciaAulas)
      .then(resultado => {
        this.alunos = resultado;

        for (let a = 0; a < this.alunos.length; a++) {
          if (this.alunos[a].inFrequencia == 'S') {
            this.totalPresencas++;
          } else {
            this.totalFaltas++;
          }
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
