import { Visita } from './../../../@core/mock/model';
import { HttpParams } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

export class VisitasFiltro {
  codigo: number;
  nome: string;
  codigoMotivo: number;
  codigoIgreja: number;
  dataVisitaDe: Date;
  dataVisitaAte: Date;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable({
  providedIn: 'root',
})
export class VisitasService {

  visitasUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
    ) {
    this.visitasUrl = `${environment.apiUrl}/visitas`;
  }

  pesquisar(filtro: VisitasFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
    });

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigoIgreja) {
      params = params.append('codigoIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigoIgreja) {
      params = params.append('codigoIgreja', filtro.codigoIgreja.toString());
    }

    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo.toString());
    }

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.codigoMotivo) {
      params = params.append('codigoMotivo', filtro.codigoMotivo.toString());
    }

    if (filtro.dataVisitaDe) {
      params = params.append('dataVisitaDe', moment(filtro.dataVisitaDe).format('YYYY-MM-DD'));
    }

    if (filtro.dataVisitaAte) {
      params = params.append('dataVisitaAte', moment(filtro.dataVisitaAte).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.visitasUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const visitas = response.content;
        this.converterStringParaData([visitas]);
        const resultado = {
          visitas: visitas,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.visitasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(visita: Visita): Promise<Visita> {
    return this.http.post<Visita>(this.visitasUrl, visita)
        .toPromise();
  }

  atualizar(visita: Visita): Promise<Visita> {
    return this.http.put<Visita>(`${this.visitasUrl}/${visita.codigo}`, visita)
      .toPromise()
      .then(response => {
        const visitaAlterado = response;

        this.converterStringParaData([visitaAlterado]);

        return visitaAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Visita> {
  return this.http.get<Visita>(`${this.visitasUrl}/${codigo}`)
    .toPromise()
    .then(response => {
      const visita = response;
      this.converterStringParaData([visita]);

      return visita;
    });
  }

  converterStringParaData(visita: Visita[]) {
    for (const v of visita) {
      if (v.dhVisita) {
        v.dhVisita = moment(v.dhVisita, 'YYYY-MM-DD HH:mm:ss').toDate();
      }
    }
  }

}
