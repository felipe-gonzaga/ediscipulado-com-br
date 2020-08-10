import { Evento } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';


export class EventosFiltro {
  nome: string;
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable()
export class EventosService {

  eventosUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp
    ) {
    this.eventosUrl = `${environment.apiUrl}/eventos`;
  }

  pesquisar(filtro: EventosFiltro): Promise<any> {
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

    return this.http.get<any>(`${this.eventosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const eventos = response.content;

        const resultado = {
          eventos: eventos,
          total: response.totalElements
        };
        return resultado;
    });
  }

  isEventoJaCadastrado(nome: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams();

    params = params.append('nome', nome);
    params = params.append('codigoIgreja', codigoIgreja.toString());

    return this.http.get(`${this.eventosUrl}/evento-ja-cadastrado`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.eventosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(evento: Evento): Promise<Evento> {
    return this.http.post<Evento>(this.eventosUrl, evento).toPromise();
  }

  atualizar(evento: Evento): Promise<Evento> {
    return this.http.put<Evento>(`${this.eventosUrl}/${evento.codigo}`, evento)
      .toPromise()
      .then(response => {
        const eventoAlterado = response;
        return eventoAlterado;
    });
  }

  listarTodas(): Promise<any> {
    const eventoFiltro = new EventosFiltro();
    // Para trazer todos
    eventoFiltro.itensPorPagina = 999;
    return this.pesquisar(eventoFiltro)
      .then(
        retorno => {
          return retorno.eventos
        });
  }

  buscarPorCodigo(codigo: number): Promise<Evento> {
    return this.http.get<Evento>(`${this.eventosUrl}/${codigo}`)
      .toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.eventosUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }
}
