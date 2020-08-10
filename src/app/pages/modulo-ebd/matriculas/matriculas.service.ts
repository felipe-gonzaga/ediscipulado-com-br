import { HttpParams } from '@angular/common/http';
import { AuthService } from './../../../auth/auth.service';
import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Matricula } from '../../../@core/mock/model';
import * as moment from 'moment';

export class MatriculasFiltro {
  codigo: number;
  cdAluno: number;
  nmAluno: string;
  cdIgreja: number;
  cdClasse: number;
  dtPeriodoMatriculaInicio: Date;
  dtPeriodoMatriculaFim: Date;
  dtEncerramento: Date;

  pagina = 0;
  itensPorPagina = 5;
}

export class PessoasMatriculasFiltro {
  cdMatricula: number;
  cdAluno: number;
  nmAluno: string;
  cdIgreja: number;
  inMatriculado: boolean;
  inNaoMatriculado: boolean;
  dtPeriodoMatriculaInicio: Date;
  dtPeriodoMatriculaFim: Date;
  dtEncerramento: Date;
}
@Injectable({
  providedIn: 'root',
})
export class MatriculasService {

  matriculasUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
  ) {
    this.matriculasUrl = `${environment.apiUrl}/matriculas`;
  }

  pesquisar(filtro: MatriculasFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
    });

    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo.toString());
    }

    if (filtro.cdAluno) {
      params = params.append('cdAluno', filtro.cdAluno.toString());
    }

    if (filtro.nmAluno) {
      params = params.append('nmAluno', filtro.nmAluno);
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.cdIgreja) {
      params = params.append('cdIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.cdIgreja) {
      params = params.append('cdIgreja', filtro.cdIgreja.toString());
    }

    if (filtro.cdClasse) {
      params = params.append('cdClasse', filtro.cdClasse.toString());
    }

    if (filtro.dtPeriodoMatriculaInicio) {
      params = params.append('dtPeriodoMatriculaInicio', moment(filtro.dtPeriodoMatriculaInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dtPeriodoMatriculaFim) {
      params = params.append('dtPeriodoMatriculaFim', moment(filtro.dtPeriodoMatriculaFim).format('YYYY-MM-DD'));
    }

    if (filtro.dtEncerramento) {
      params = params.append('dtEncerramento', moment(filtro.dtEncerramento).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.matriculasUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const matriculas = response.content;
        const resultado = {
          matriculas: matriculas,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  pesquisaPessoaMatricula(filtro: PessoasMatriculasFiltro): Promise<any> {
    let params = new HttpParams();

    if (filtro.cdMatricula) {
      params = params.append('cdMatricula', filtro.cdMatricula.toString());
    }

    if (filtro.cdAluno) {
      params = params.append('cdAluno', filtro.cdAluno.toString());
    }

    if (filtro.nmAluno) {
      params = params.append('nmAluno', filtro.nmAluno);
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.cdIgreja) {
      params = params.append('cdIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.cdIgreja) {
      params = params.append('cdIgreja', filtro.cdIgreja.toString());
    }

    if (filtro.inMatriculado) {
      params = params.append('inMatriculado', filtro.inMatriculado.toString());
    }

    if (filtro.inNaoMatriculado) {
      params = params.append('inNaoMatriculado', filtro.inNaoMatriculado.toString());
    }

    if (filtro.dtPeriodoMatriculaInicio) {
      params = params.append('dtPeriodoMatriculaInicio', moment(filtro.dtPeriodoMatriculaInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dtPeriodoMatriculaFim) {
      params = params.append('dtPeriodoMatriculaFim', moment(filtro.dtPeriodoMatriculaFim).format('YYYY-MM-DD'));
    }

    if (filtro.dtEncerramento) {
      params = params.append('dtEncerramento', moment(filtro.dtEncerramento).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.matriculasUrl}?resumo-pessoa-matricula`, { params })
      .toPromise()
      .then(response => {
        const matriculas = response.content;
        const resultado = {
          matriculas: matriculas,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Matricula> {
    return this.http.get<Matricula>(`${this.matriculasUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const matricula = response;
        this.converterStringParaData([matricula]);

        return matricula;
      });
  }

  excluir (codigo: number): Promise<void> {

    return this.http.delete(`${this.matriculasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(matricula: Matricula): Promise<Matricula> {

    return this.http.post<Matricula>(this.matriculasUrl, matricula)
        .toPromise();

  }

  atualizar(matricula: Matricula): Promise<Matricula> {
    return this.http.put<Matricula>(`${this.matriculasUrl}/${matricula.codigo}`, matricula)
      .toPromise()
      .then(response => {
        const matriculaAlterado = response;
        this.converterStringParaData([matriculaAlterado]);

        return matriculaAlterado;
      });
  }

  converterStringParaData(matriculas: Matricula[]) {
    for (const m of matriculas) {
      if (m.dtMatricula) {
        m.dtMatricula = moment(m.dtMatricula, 'YYYY-MM-DD').toDate();
      }
      if (m.dtEncerramento) {
        m.dtEncerramento = moment(m.dtEncerramento, 'YYYY-MM-DD').toDate();
      }
    }
  }

}
