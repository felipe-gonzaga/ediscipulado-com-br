import { LicaoAdicional } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class ConteudosAdicionalsFiltro {
  nome: string;
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable({
  providedIn: 'root',
})
export class ConteudoAdicionalService {

  licoesAdicionaisUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
  ) {
    this.licoesAdicionaisUrl = `${environment.apiUrl}/licoes-adicionais`;
  }

  pesquisar(filtro: ConteudosAdicionalsFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (!this.auth.temPermissao('ROLE_ADMINISTRADOR') && !filtro.codigoIgreja) {
      params = params.append('codigoIgreja', this.auth.jwtPayload.codigoIgreja);
    } else if (filtro.codigoIgreja) {
      params = params.append('codigoIgreja', filtro.codigoIgreja.toString());
    }

    if (filtro.ativo) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    return this.http.get<any>(`${this.licoesAdicionaisUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const conteudosAdicionais = response.content;
        const resultado = {
          conteudosAdicionais: conteudosAdicionais,
          total: response.totalElements,
        };
        return resultado;
    });
  }


  /** */
  buscarPorCodigo(codigo: number): Promise<LicaoAdicional> {
    return this.http.get<LicaoAdicional>(`${this.licoesAdicionaisUrl}/${codigo}`)
      .toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.licoesAdicionaisUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(licaoAdicional: LicaoAdicional): Promise<LicaoAdicional> {
    return this.http.post<LicaoAdicional>(this.licoesAdicionaisUrl, licaoAdicional).toPromise();
  }


  atualizar(licaoAdicional: LicaoAdicional): Promise<LicaoAdicional> {
    return this.http.put<LicaoAdicional>(`${this.licoesAdicionaisUrl}/${licaoAdicional.codigo}`, licaoAdicional)
      .toPromise()
      .then(response => {
        const classeAlterado = response;
        return classeAlterado;
    });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.licoesAdicionaisUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  isLicaoAdicionalJaCadastrado(nome: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams();

    params = params.append('nome', nome);
    params = params.append('codigoIgreja', codigoIgreja.toString());

    return this.http.get(`${this.licoesAdicionaisUrl}/licao-adicional-ja-cadastrado`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

}
