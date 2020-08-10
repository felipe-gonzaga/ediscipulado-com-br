import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


export class UsuariosFiltro {
  nome: string;
  email: string;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class AuthService {

  oAuthTokenUrl: string;
  jwtPayload: any;
  publicosUrl: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) {
      this.oAuthTokenUrl = `${environment.apiUrl}/oauth/token`;
      this.publicosUrl = `${environment.apiUrl}/publicos`;
      this.carregarToken();
  }


  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/x-www-form-urlencoded')
    .append('Authorization', 'Basic ZWRpc2NpcHVsYWRvLWFuZ3VsYXI6M2Qxc2MxcHVsQGQwLUBuZ3VsQHItMA==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post<any>(this.oAuthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);
      })
      .catch(response => {
        if (response.status === 400) {
          if (response.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválido');
          }
        }
        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic ZWRpc2NpcHVsYWRvLWFuZ3VsYXI6M2Qxc2MxcHVsQGQwLUBuZ3VsQHItMA==');

    const body = 'grant_type=refresh_token';

    return this.http.post<any>(this.oAuthTokenUrl, body, { headers, withCredentials: true })
    .toPromise()
    .then(response => {
      this.armazenarToken(response.access_token);
      console.log('Novo access token criado.');
      return Promise.resolve(null);
    })
    .catch(response => {
      console.error('Erro ao renovar token', response);
      return Promise.resolve(null);
    });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

  /* CONSULTA PUBLICA */
  pesquisarConsultaPublica(filtro: UsuariosFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.email) {
      params = params.append('email', filtro.email);
    }

    if (filtro.ativo) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    return this.http.get<any>(`${this.publicosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const usuarios = response.content;

        const resultado = {
          usuarios: usuarios,
          total: response.totalElements,
        };
        return resultado;
    });
  }

}
