import { Igreja } from './../../../@core/mock/model';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import * as moment from 'moment';


export class IgrejasFiltro {
  codigo: number;
  nome: string;
  sigla: string;
  dataInicioAtividade: Date;
  dataFimAtividade: Date;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable()
export class IgrejasService {

  igrejasUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp
    ) {
    this.igrejasUrl = `${environment.apiUrl}/igrejas`;
  }

  listarPorUsuario(): Promise<any> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      const filtro = new IgrejasFiltro();
      filtro.itensPorPagina = 999;
      return this.pesquisar(filtro).then(igrejas => {
        return igrejas.igrejas;
      });
    } else {
      return this.http.get<Igreja>(`${this.igrejasUrl}/por-usuario/${this.auth.jwtPayload.codigoUsuario}`)
      .toPromise();
    }
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.igrejasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(igreja: Igreja): Promise<Igreja> {
    return this.http.post<Igreja>(this.igrejasUrl, igreja)
        .toPromise();
  }

  atualizar(igreja: Igreja): Promise<Igreja> {
    return this.http.put<Igreja>(`${this.igrejasUrl}/${igreja.codigo}`, igreja)
      .toPromise()
      .then(response => {
        const igrejaAlterada = response;
        this.converterStringParaData([igrejaAlterada]);

        return igrejaAlterada;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Igreja> {
    return this.http.get<Igreja>(`${this.igrejasUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const igrejas = response;

        this.converterStringParaData([igrejas]);

        return igrejas;
      });
   }

  listarTodasAtivas(): Promise<any> {
    return this.http.get(`${this.igrejasUrl}`).toPromise();
  }

  pesquisar(filtro: IgrejasFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigo) {
      console.log('entrou 1');
      params = params.append('codigo', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigo) {
      console.log('entrou 2');
      params = params.append('codigo', filtro.codigo.toString());
    }

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.sigla) {
      params = params.append('sigla', filtro.sigla);
    }

    if (filtro.dataInicioAtividade) {
      params = params.append('dataInicioAtividade', moment(filtro.dataInicioAtividade).format('YYYY-MM-DD'));
    }

    if (filtro.dataFimAtividade) {
      params = params.append('dataFimAtividade', moment(filtro.dataFimAtividade).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.igrejasUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const igrejas = response.content;

        const resultado = {
          igrejas: igrejas,
          total: response.totalElements
        };
        return resultado;
    });
  }

  converterStringParaData(igrejas: Igreja[]) {
    for (const i of igrejas) {
      if (i.dataInicioAtividade) {
        i.dataInicioAtividade = moment(i.dataInicioAtividade, 'YYYY-MM-DD').toDate();
      }
      if (i.dataFimAtividade) {
        i.dataFimAtividade = moment(i.dataFimAtividade, 'YYYY-MM-DD').toDate();
      }
    }
  }

}
