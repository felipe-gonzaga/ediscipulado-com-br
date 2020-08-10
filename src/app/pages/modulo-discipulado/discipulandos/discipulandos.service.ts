import { Discipulando } from './../../../@core/mock/model';
import { HttpParams } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

export class DiscipulandosFiltro {
  nome: string;
  dataConversaoDe: Date;
  dataConversaoAte: Date;
  siglaIgrejaDiscipulando: string;
  localConversao: number;
  eventoConversao: number;
  codigoIgreja: number;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class DiscipulandosService {

  discipulandosUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp) {
    this.discipulandosUrl = `${environment.apiUrl}/discipulandos`;
  }

  pesquisar(filtro: DiscipulandosFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.dataConversaoDe) {
      params = params.append('dataConversaoDe', moment(filtro.dataConversaoDe).format('YYYY-MM-DD'));
    }

    if (filtro.dataConversaoAte) {
      params = params.append('dataConversaoAte', moment(filtro.dataConversaoAte).format('YYYY-MM-DD'));
    }

    if (filtro.localConversao) {
      params = params.append('localConversao', filtro.localConversao.toString());
    }

    if (filtro.eventoConversao) {
      params = params.append('eventoConversao', filtro.eventoConversao.toString());
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigoIgreja) {
      params = params.append('codigoIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigoIgreja) {
      params = params.append('codigoIgreja', filtro.codigoIgreja.toString());
    }

    return this.http.get<any>(`${this.discipulandosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const discipulandos = response.content;

        const resultado = {
          discipulandos: discipulandos,
          total: response.totalElements,
        };
      return resultado;
    });
  }

  excluir (codigo: number): Promise<void> {

    return this.http.delete(`${this.discipulandosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(discipulando: Discipulando): Promise<Discipulando> {

    return this.http.post<Discipulando>(this.discipulandosUrl, discipulando)
        .toPromise();

  }

  atualizar(discipulando: Discipulando): Promise<Discipulando> {
    return this.http.put<Discipulando>(`${this.discipulandosUrl}/${discipulando.codigo}`, discipulando)
      .toPromise()
      .then(response => {
        const discipulandoAlterado = response;
        this.converterStringParaData([discipulandoAlterado]);

        return discipulandoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Discipulando> {
  return this.http.get<Discipulando>(`${this.discipulandosUrl}/${codigo}`)
    .toPromise()
    .then(response => {
      const discipulando = response;
      this.converterStringParaData([discipulando]);

      return discipulando;
    });
  }

  converterStringParaData(discipulandos: Discipulando[]) {
    for (const d of discipulandos) {
      if (d.dataNascimento) {
        d.dataNascimento = moment(d.dataNascimento, 'YYYY-MM-DD').toDate();
      }
      if (d.dataBatismo) {
        d.dataBatismo = moment(d.dataBatismo, 'YYYY-MM-DD').toDate();
      }
      if (d.dataConversao) {
        d.dataConversao = moment(d.dataConversao, 'YYYY-MM-DD').toDate();
      }
      if (d.dataInicioPeriodoDiscipulado) {
        d.dataInicioPeriodoDiscipulado = moment(d.dataInicioPeriodoDiscipulado, 'YYYY-MM-DD').toDate();
      }
      if (d.dataFimPeriodoDiscipulado) {
        d.dataFimPeriodoDiscipulado = moment(d.dataFimPeriodoDiscipulado, 'YYYY-MM-DD').toDate();
      }
    }
  }

}
