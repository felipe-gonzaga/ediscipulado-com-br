import { Aula } from './../../../@core/mock/model';
import { HttpParams } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import * as moment from 'moment';


export class AulasFiltro {
  codigo: number;
  nmProfessor: string;
  cdIgreja: number;
  cdCiclo: number;
  cdClasse: number;
  cdLicaoAdicional: number;
  inAvaliarAula: boolean;
  dtPeriodoAulaInicio: Date;
  dtPeriodoAulaFim: Date;

  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class AulasService {

  aulasUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
  ) {
    this.aulasUrl = `${environment.apiUrl}/aulas`;
  }

  pesquisar(filtro: AulasFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
    });

    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo.toString());
    }

    if (filtro.nmProfessor) {
      params = params.append('nmProfessor', filtro.nmProfessor);
    }

    if (filtro.cdCiclo) {
      params = params.append('cdCiclo', filtro.cdCiclo.toString());
    }

    if (filtro.cdClasse) {
      params = params.append('cdClasse', filtro.cdClasse.toString());
    }

    if (filtro.cdLicaoAdicional) {
      params = params.append('cdLicaoAdicional', filtro.cdLicaoAdicional.toString());
    }

    if (filtro.inAvaliarAula) {
      params = params.append('inAvaliarAula', filtro.inAvaliarAula.toString());
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.cdIgreja) {
      params = params.append('cdIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.cdIgreja) {
      params = params.append('cdIgreja', filtro.cdIgreja.toString());
    }

    if (filtro.dtPeriodoAulaInicio) {
      params = params.append('dtPeriodoAulaInicio', moment(filtro.dtPeriodoAulaInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dtPeriodoAulaFim) {
      params = params.append('dtPeriodoAulaFim', moment(filtro.dtPeriodoAulaFim).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.aulasUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const aulas = response.content;
        const resultado = {
          aulas: aulas,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Aula> {
    return this.http.get<Aula>(`${this.aulasUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const matricula = response;
        this.converterStringParaData([matricula]);

        return matricula;
      });
  }

  adicionar(aula: Aula): Promise<Aula> {
    return this.http.post<Aula>(this.aulasUrl, aula).toPromise();
  }

  atualizar(aula: Aula): Promise<Aula> {
    return this.http.put<Aula>(`${this.aulasUrl}/${aula.codigo}`, aula)
      .toPromise()
      .then(response => {
        const aulaAlterado = response;
        return aulaAlterado;
    });
  }

  excluir (codigo: number): Promise<void> {

    return this.http.delete(`${this.aulasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  converterStringParaData(aulas: Aula[]) {
    for (const a of aulas) {
      if (a.dtAula) {
        a.dtAula = moment(a.dtAula, 'YYYY-MM-DD').toDate();
      }
    }
  }
}
