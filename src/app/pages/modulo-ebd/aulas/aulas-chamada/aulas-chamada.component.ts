import { FrequenciasService, FrequeciaAulasFiltro } from './../../frequencias/frequencias.service';
import { FormControl } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { MatriculasService } from './../../matriculas/matriculas.service';
import { Aula, Frequencia, Aluno } from './../../../../@core/mock/model';
import { AuthService } from './../../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { AulasService } from './../aulas.service';
import { Component, OnInit } from '@angular/core';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Title } from '@angular/platform-browser';
import { MatriculasFiltro } from '../../matriculas/matriculas.service';

@Component({
  selector: 'aulas-chamada',
  templateUrl: './aulas-chamada.component.html',
  styleUrls: ['./aulas-chamada.component.scss']
})
export class AulasChamadaComponent implements OnInit {

  totalRegistros = 0;
  aula = new Aula();
  loading = false;
  dsLicao: String;
  dsAvaliacao: String;
  alunos = [];
  alunosSelecionados = [];
  filtroFrequeciaAulas = new FrequeciaAulasFiltro();

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

    this.title.setTitle('Nova Aula');

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
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarFrequenciaAlunosMatriculados(pagina = 0) {
    this.filtroFrequeciaAulas.cdAula = this.aula.codigo;

    this.frequenciasService.pesquisaFrequeciaAulas(this.filtroFrequeciaAulas)
    .then(resultado => {
      this.alunos = resultado;
      this.selecionarFrequenciaAlunosMatriculados();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  selecionarFrequenciaAlunosMatriculados() {
    let cont = 0;
    for (let a = 0; a < this.alunos.length; a++) {
      if (this.alunos[a].inFrequencia == 'S') {
        this.alunosSelecionados[cont] = this.alunos[a].cdAluno;
        cont++;
      }
    }
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.carregarFrequenciaAlunosMatriculados(pagina);
  }

  salvar(form: FormControl) {
    this.loading = true;

    const listaFrequencia = new Array<Frequencia>();

    for (let i = 0; i < this.alunosSelecionados.length; i++) {
      let frequencia = new Frequencia();
      let aluno = new Aluno();
      aluno.codigo = this.alunosSelecionados[i];

      frequencia.aluno = aluno;
      frequencia.aula.codigo = this.aula.codigo;
      frequencia.dtAula = this.aula.dtAula;

       listaFrequencia.push(frequencia);
    }


    this.frequenciasService.registrarFrequencia(listaFrequencia)
    .then(aulaAlterado => {
      this.loading = false;

      this.messageService.showToast('Sucesso', 'Chamada realizada com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/aulas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

}
