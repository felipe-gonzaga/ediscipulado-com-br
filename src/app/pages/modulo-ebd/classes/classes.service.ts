import { Classe } from './../../../@core/mock/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class ClassesFiltro {
  nome: string;
  codigoIgreja: number;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}
@Injectable({
  providedIn: 'root',
})
export class ClassesService {

  classesUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
  ) {
    this.classesUrl = `${environment.apiUrl}/classes`;
  }

  pesquisar(filtro: ClassesFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
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

    return this.http.get<any>(`${this.classesUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const classes = response.content;
        const resultado = {
          classes: classes,
          total: response.totalElements,
        };
        return resultado;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Classe> {
    return this.http.get<Classe>(`${this.classesUrl}/${codigo}`)
      .toPromise();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http.put(`${this.classesUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  isClasseJaCadastrada(nome: string, codigoIgreja: number): Promise<any> {
    let params = new HttpParams().append('nome', nome);

    params = params.append('codigoIgreja', codigoIgreja.toString());

    return this.http.get(`${this.classesUrl}/classe-ja-cadastrada`, { params })
      .toPromise()
      .then(response => {
        return response as boolean;
      });
  }

  adicionar(classe: Classe): Promise<Classe> {
    return this.http.post<Classe>(this.classesUrl, classe).toPromise();
  }


  atualizar(classe: Classe): Promise<Classe> {
    return this.http.put<Classe>(`${this.classesUrl}/${classe.codigo}`, classe)
      .toPromise()
      .then(response => {
        const classeAlterado = response;
        return classeAlterado;
    });
  }

  excluir (codigo: number): Promise<void> {
    return this.http.delete(`${this.classesUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

}
