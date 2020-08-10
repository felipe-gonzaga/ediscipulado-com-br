import { Discipulador } from './../../../@core/mock/model';
import { HttpParams } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

export class DiscipuladoresFiltro {
  nome: string;
  dataInicioVigencia: Date;
  dataFimVigencia: Date;
  cargo: number;
  cargos = Array();
  codigoIgreja: number;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class DiscipuladoresService {

  discipuladoresUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp) {
    this.discipuladoresUrl = `${environment.apiUrl}/discipuladores`;
  }

  pesquisar(filtro: DiscipuladoresFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      },
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.dataInicioVigencia) {
      params = params.append('dataInicioVigencia', moment(filtro.dataInicioVigencia).format('YYYY-MM-DD'));
    }

    if (filtro.dataFimVigencia) {
      params = params.append('dataFimVigencia', moment(filtro.dataFimVigencia).format('YYYY-MM-DD'));
    }

    if (filtro.cargo) {
      params = params.append('cargo', filtro.cargo.toString());
    }

    if (filtro.cargos && filtro.cargos.length > 0) {
      params = params.append('cargos', filtro.cargos.toString());
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigoIgreja) {
      params = params.append('codigoIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigoIgreja) {
      params = params.append('codigoIgreja', filtro.codigoIgreja.toString());
    }

    return this.http.get<any>(`${this.discipuladoresUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const discipuladores = response.content;

        const resultado = {
          discipuladores: discipuladores,
          total: response.totalElements
        };
        return resultado;
      })
    }

    excluir (codigo: number): Promise<void> {

      return this.http.delete(`${this.discipuladoresUrl}/${codigo}`)
        .toPromise()
        .then(() => null);
    }

    adicionar(discipulador: Discipulador): Promise<Discipulador> {

      return this.http.post<Discipulador>(this.discipuladoresUrl, discipulador)
          .toPromise();

    }

    atualizar(discipulador: Discipulador): Promise<Discipulador> {

      return this.http.put<Discipulador>(`${this.discipuladoresUrl}/${discipulador.codigo}`, discipulador)
        .toPromise()
        .then(response => {
          const discipuladorAlterado = response;
          this.converterStringParaData([discipuladorAlterado]);

          return discipuladorAlterado;
        });
    }

    buscarPorCodigo(codigo: number): Promise<Discipulador> {

    return this.http.get<Discipulador>(`${this.discipuladoresUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const discipulador = response;

        this.converterStringParaData([discipulador]);

        return discipulador;
      });
    }

    converterStringParaData(discipuladores: Discipulador[]) {
      for (const d of discipuladores) {
        if (d.dataNascimento) {
          d.dataNascimento = moment(d.dataNascimento, 'YYYY-MM-DD').toDate();
        }
        if (d.dataInicioVigenciaDiscipulador) {
          d.dataInicioVigenciaDiscipulador = moment(d.dataInicioVigenciaDiscipulador, 'YYYY-MM-DD').toDate();
        }
        if (d.dataFimVigenciaDiscipulador) {
          d.dataFimVigenciaDiscipulador = moment(d.dataFimVigenciaDiscipulador, 'YYYY-MM-DD').toDate();
        }
      }
    }
}
