import { Local } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class LocaisFiltro {
  nome: string;
  tipo: string;
  tipos = Array();
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable({
  providedIn: 'root'
})
export class LocaisService {

  locaisUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
    ) {
    this.locaisUrl = `${environment.apiUrl}/locais`;
  }

  pesquisar(filtro: LocaisFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigoIgreja) {
      params = params.append('codigoIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigoIgreja) {
      params = params.append('codigoIgreja', filtro.codigoIgreja.toString());
    }

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.tipo) {
      params = params.append('tipo', filtro.tipo);
    }

    if (filtro.tipos && filtro.tipos.length > 0) {
      params = params.append('tipos', filtro.tipos.toString());
    }

    if (filtro.ativo) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    return this.http.get<any>(`${this.locaisUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const locais = response.content;

        const resultado = {
          locais: locais,
          total: response.totalElements
        };
        return resultado;
    });
  }

  listarTodas(): Promise<any> {
    const localFiltro = new LocaisFiltro();
    // Para trazer todos
    localFiltro.itensPorPagina = 999;
    return this.pesquisar(localFiltro)
      .then(
        retorno => {
          return retorno.locais
    } );
  }

  isLocalJaCadastrado(nome: string, tipo: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams();

    params = params.append('nome', nome);
    params = params.append('tipo', tipo);
    params = params.append('codigoIgreja', codigoIgreja.toString());

    return this.http.get(`${this.locaisUrl}/local-ja-cadastrado`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.locaisUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(local: Local): Promise<Local> {

    return this.http.post<Local>(this.locaisUrl, local).toPromise();

  }

  atualizar(local: Local): Promise<Local> {
    return this.http.put<Local>(`${this.locaisUrl}/${local.codigo}`, local)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Local> {
    return this.http.get<Local>(`${this.locaisUrl}/${codigo}`).toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.locaisUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }
}
