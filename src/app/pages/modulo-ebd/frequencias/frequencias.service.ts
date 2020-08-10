import { HttpParams } from '@angular/common/http';
import { Frequencia } from './../../../@core/mock/model';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

export class FrequenciasFiltro {
  codigo: number;
  cdIgreja: number;
  cdAula: number;
  cdCiclo: number;
  cdClasse: number;
  cdLicao: number;
  cdLicaoAdicional: number;
  dtPeriodoAulaInicio: Date;
  dtPeriodoAulaFim: Date;

  pagina = 0;
  itensPorPagina = 5;
}

export class FrequeciaAulasFiltro {
  cdAula: number;
  cdMatricula: number;
  cdAluno: number;
  nmAluno: string;
  cdIgreja: number;
  inFrequencia: boolean;
  inMatriculado: boolean;
  inNaoMatriculado: boolean;
  dtPeriodoMatriculaInicio: Date;
  dtPeriodoMatriculaFim: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FrequenciasService {

  frequenciasUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
  ) {
    this.frequenciasUrl = `${environment.apiUrl}/frequencias`;
  }

  pesquisar(filtro: FrequenciasFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
    });

    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo.toString());
    }

    if (filtro.cdAula) {
      params = params.append('cdAula', filtro.cdAula.toString());
    }

    if (filtro.cdCiclo) {
      params = params.append('cdCiclo', filtro.cdCiclo.toString());
    }

    if (filtro.cdLicao) {
      params = params.append('cdLicao', filtro.cdLicao.toString());
    }

    if (filtro.cdClasse) {
      params = params.append('cdClasse', filtro.cdClasse.toString());
    }

    if (filtro.cdLicaoAdicional) {
      params = params.append('cdLicaoAdicional', filtro.cdLicaoAdicional.toString());
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

    return this.http.get<any>(`${this.frequenciasUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const frequencias = response.content;
        const resultado = {
          frequencias: frequencias,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  pesquisaFrequeciaAulas(filtro: FrequeciaAulasFiltro): Promise<any> {
    let params = new HttpParams();

    if (filtro.cdAula) {
      params = params.append('cdAula', filtro.cdAula.toString());
    }

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

    if (filtro.inFrequencia) {
      params = params.append('inFrequencia', filtro.inFrequencia.toString());
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

    return this.http.get<any>(`${this.frequenciasUrl}?resumo-frequencia-aula`, { params })
      .toPromise();
  }

  registrarFrequencia(frequencias:  Array<Frequencia>): Promise<Frequencia> {
      return this.http.post<Frequencia>(this.frequenciasUrl, frequencias).toPromise();
  }

}
