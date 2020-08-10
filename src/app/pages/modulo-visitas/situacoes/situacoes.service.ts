import { Situacao } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class SituacoesFiltro {
  codigo: number;
  descricao: string;
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root',
})
export class SituacoesService {

  situacoesUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
    ) {
    this.situacoesUrl = `${environment.apiUrl}/situacoes`;
  }

  pesquisar(filtro: SituacoesFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
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

    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }

    if (filtro.ativo) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    return this.http.get<any>(`${this.situacoesUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const situacoes = response.content;

        const resultado = {
          situacoes: situacoes,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  listarTodas(): Promise<any> {
    const filtro = new SituacoesFiltro();
    // Para trazer todos
    filtro.itensPorPagina = 999;
    return this.pesquisar(filtro)
      .then(
        retorno => {
          return retorno.situacoes;
    } );
  }

  isSituacaoJaCadastrado(descricao: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams();

    params = params.append('descricao', descricao);
    params = params.append('codigoIgreja', codigoIgreja.toString());

    return this.http.get(`${this.situacoesUrl}/motivo-ja-cadastrado`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.situacoesUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(situacao: Situacao): Promise<Situacao> {
    return this.http.post<Situacao>(this.situacoesUrl, situacao).toPromise();
  }

  atualizar(situacao: Situacao): Promise<Situacao> {
    return this.http.put<Situacao>(`${this.situacoesUrl}/${situacao.codigo}`, situacao)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Situacao> {
    return this.http.get<Situacao>(`${this.situacoesUrl}/${codigo}`).toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.situacoesUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

}
