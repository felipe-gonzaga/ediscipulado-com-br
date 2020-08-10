import { Motivo } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class MotivosFiltro {
  codigo: number;
  nome: string;
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root',
})
export class MotivosService {

  motivosUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
    ) {
    this.motivosUrl = `${environment.apiUrl}/motivos`;
  }

  pesquisar(filtro: MotivosFiltro): Promise<any> {
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

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.ativo) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    return this.http.get<any>(`${this.motivosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const motivos = response.content;

        const resultado = {
          motivos: motivos,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  listarTodas(): Promise<any> {
    const filtro = new MotivosFiltro();
    // Para trazer todos
    filtro.itensPorPagina = 999;
    return this.pesquisar(filtro)
      .then(
        retorno => {
          return retorno.motivos;
    } );
  }

  isMotivoJaCadastrado(nome: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams();

    params = params.append('nome', nome);
    params = params.append('codigoIgreja', codigoIgreja.toString());


    return this.http.get(`${this.motivosUrl}/motivo-ja-cadastrado`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.motivosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(motivo: Motivo): Promise<Motivo> {
    return this.http.post<Motivo>(this.motivosUrl, motivo).toPromise();
  }

  atualizar(motivo: Motivo): Promise<Motivo> {
    return this.http.put<Motivo>(`${this.motivosUrl}/${motivo.codigo}`, motivo)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Motivo> {
    return this.http.get<Motivo>(`${this.motivosUrl}/${codigo}`).toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.motivosUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }
}
