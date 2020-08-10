import { Aluno } from './../../../../@core/mock/model';
import { MessageService } from './../../../../@core/message.service';
import { FormControl } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { DiscipulandosFiltro, DiscipulandosService } from './../../../modulo-discipulado/discipulandos/discipulandos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../../auth/auth.service';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { ClassesService } from './../../classes/classes.service';
import { MatriculasService, MatriculasFiltro, PessoasMatriculasFiltro } from './../matriculas.service';
import { Component, OnInit } from '@angular/core';
import { Matricula } from '../../../../@core/mock/model';
import { ClassesFiltro } from '../../classes/classes.service';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'matriculas-cadastro',
  templateUrl: './matriculas-cadastro.component.html',
  styleUrls: ['./matriculas-cadastro.component.scss']
})
export class MatriculasCadastroComponent implements OnInit {

  totalRegistros = 0;
  filtroAlunoMatricula = new PessoasMatriculasFiltro();
  matricula = new Matricula();
  loading = false;
  igrejas = [];
  classes = [];
  alunos = [];
  alunosSelecionados = [];


  constructor(
    private matriculasService: MatriculasService,
    private igrejasService: IgrejasService,
    private classesService: ClassesService,
    private discipulandosService: DiscipulandosService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private uteis: UteisService,
    public auth: AuthService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    const codigoMatricula = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Matrículas');


    if (codigoMatricula) {

      this.loading = true;

      setTimeout(function() {
        this.carregarMatricula(codigoMatricula);
        // Carrega deixando checked a igreja do usuario logado
        this.matricula.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
      }.bind(this), 2000);
    }

    await this.carregarIgrejas();
    this.atualizarClassesPorIgreja();
  }

  carregarMatricula(codigo: number) {
    this.matriculasService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.matricula = response;

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarClassesPorIgreja() {
    const filtro = new ClassesFiltro();
    filtro.codigoIgreja = this.matricula.igreja.codigo;
    filtro.itensPorPagina = 999;
    this.classesService.pesquisar(filtro)
    .then(classes => {
      this.classes = classes.classes.map(c => ({ name: c.nome, value: c.codigo }));

      // Caso só tenha 1 item na lista. Deixe checkado
      if (this.uteis.tamanholista(this.classes) === 1) {
        this.matricula.classe.codigo = this.classes[0].value;
      }
    })
    .catch(erro => this.errorHandler.handle(erro));
}

async carregarIgrejas() {
  return await this.igrejasService.listarPorUsuario()
    .then(igrejas => {
       this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
       // Carrega deixando checked a igreja do usuario logado
        this.matricula.igreja.codigo = this.auth.jwtPayload.codigoIgreja;
    })
    .catch(erro => this.errorHandler.handle(erro));
}

pesquisaPessoaMatricula(pagina = 0) {
  if (this.uteis.tamanholista(this.igrejas) === 1) {
    this.filtroAlunoMatricula.cdIgreja = this.igrejas[0].value;
  }

  this.filtroAlunoMatricula.inNaoMatriculado = true;

  this.matriculasService.pesquisaPessoaMatricula(this.filtroAlunoMatricula)
    .then(resultado => {
      this.totalRegistros = resultado.total;
      this.alunos = resultado.matriculas;
    })
    .catch(erro => this.errorHandler.handle(erro));
}

aoMudarPagina(event: LazyLoadEvent) {
  const pagina = event.first / event.rows;
  this.pesquisaPessoaMatricula(pagina);
}

escolherAluno(checked: boolean, codigo: any) {
  if (checked)
    this.matricula.aluno.codigo = codigo;
  else
    this.matricula.aluno.codigo = null;

}
salvar(form: FormControl) {

  this.loading = true;

  if (!this.matricula.aluno.codigo) {
    this.messageService.showToast('Aviso', 'É preciso selecionar um Aluno.', this.messageService.types[3]);
    this.loading = false;
    return;
  }

  if (this.editando) {
    this.atualizarMatricula(form);
  } else {
    this.adicionarMatricula(form);
  }
}

adicionarMatricula(form: FormControl) {

  this.matriculasService.adicionar(this.matricula)
    .then(discipulandoAdicionado => {

      this.loading = false;

      this.messageService.showToast('Sucesso', 'Matrícula realizada com sucesso.', this.messageService.types[1]);

      this.router.navigate(['pages/matriculas']);
    })
    .catch(erro => {
      this.loading = false;
      this.errorHandler.handle(erro);
    });
}

atualizarMatricula(form: FormControl) {
  let codigoAluno = this.matricula.aluno.codigo;

  this.matricula.aluno = new Aluno();
  this.matricula.aluno.codigo = codigoAluno;

  this.matriculasService.atualizar(this.matricula)
  .then(response => {

    this.loading = false;

    this.matricula = response;

    this.messageService.showToast('Sucesso', 'Matrícula alterado com sucesso.', this.messageService.types[1]);
    this.router.navigate(['pages/matriculas']);
  })
  .catch(erro => {
    this.loading = false;
    this.errorHandler.handle(erro);
  });
}

// Se existir codigo no discipulando é porque é uma edição
get editando() {
  return this.matricula.codigo;
}

}
