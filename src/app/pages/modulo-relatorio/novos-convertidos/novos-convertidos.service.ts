import { AuthService } from './../../../auth/auth.service';
import { DiscipulandosFiltro } from './../../modulo-discipulado/discipulandos/discipulandos.service';
import { HttpParams } from '@angular/common/http';
import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class NovosConvertidosService {

  discipulandosUrl: string;
  constructor(
    public auth: AuthService,
    private http: MoneyHttp,
    ) {
    this.discipulandosUrl = `${environment.apiUrl}/discipulandos`;
  }

  relatorioNovosConvertidos(filtro: DiscipulandosFiltro) {
    let params = new HttpParams();

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

    return this.http.get(`${this.discipulandosUrl}/relatorio/novos-convertidos`,
      { params, responseType: 'blob' })
      .toPromise();
  }
}
