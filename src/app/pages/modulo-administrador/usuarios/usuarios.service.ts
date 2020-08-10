import { AuthService } from '../../../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MoneyHttp } from '../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../@core/mock/model';

export class UsuariosFiltro {
  nome: string;
  email: string;
  ativo: Boolean;
  pagina = 0;
  itensPorPagina = 5;
}
export class UsuarioAlterarSenha {
  senhaAtual = '';
  novaSenha = '';
  confirmeSenha = '';
}
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  usuariosUrl: string;
  publicosUrl: string;

  constructor(
    private http: MoneyHttp,
    private httpClient: HttpClient,
    private auth: AuthService,
    ) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
    this.publicosUrl = `${environment.apiUrl}/publicos`;
  }

  buscarPorCodigo(codigo: number): Promise<Usuario> {
  return this.http.get<Usuario>(`${this.usuariosUrl}/${codigo}`)
    .toPromise()
    .then(response => {
      const usuario = response;
      // this.converterStringParaData([usuario]);

      return usuario;
    });
  }

  listarPermissoes(): Promise<any> {
    return this.http.get<any>(`${this.usuariosUrl}/permissoes`)
      .toPromise()
      .then();
    }

  pesquisar(filtro: UsuariosFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
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

    return this.http.get<any>(`${this.usuariosUrl}?resumo`, { params })
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

  atualizar(usuario: Usuario): Promise<Usuario> {
    return this.http.put<Usuario>(`${this.usuariosUrl}/permissoes/${usuario.codigo}`, usuario)
      .toPromise()
      .then();
  }

  alternarStatus(codigo: number, ativo: boolean): Promise<void> {
    return this.http.put(`${this.usuariosUrl}/${codigo}/ativo`, ativo)
      .toPromise()
      .then(() => null);
  }

  /**
   * Serviço Esqueceu Senha
   * @param email
   */
  esqueceuSenha(email: string): Promise<void> {
    return this.httpClient.post(`${this.publicosUrl}/esqueceu-senha`, email)
      .toPromise()
      .then(() => null);
  }

  /**
   * Serviço de alteração de senha
   * @param usuarioAlterarSenha
   */
  alterarSenha(usuarioAlterarSenha: UsuarioAlterarSenha): Promise<void> {
    return this.http.put(`${this.usuariosUrl}/alterar-senha/${this.auth.jwtPayload.codigoUsuario}`, usuarioAlterarSenha)
      .toPromise()
      .then(() => null);
  }

  /**
   *
   */
  pesquisarConsultaPublica(filtro: UsuariosFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
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

    return this.httpClient.get<any>(`${this.publicosUrl}?resumo`, { params })
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
