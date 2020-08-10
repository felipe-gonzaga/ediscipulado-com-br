import { HttpParams } from '@angular/common/http';
import { AuthService } from './../../auth/auth.service';
import { MoneyHttp } from './../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  discipuladoresUrl: string;
  discipulandosUrl: string;

  constructor(private http: MoneyHttp, private auth: AuthService) {
    this.discipuladoresUrl =  `${environment.apiUrl}/discipuladores`;
    this.discipulandosUrl = `${environment.apiUrl}/discipulandos`;
  }
  // Grafico de pizza por cargo ou por cargo da igreja - INICIO
  discipuladoresIgrejaPorCargo(): Promise<Array<any>> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      return this.discipuladoresPorCargo();
    } else {
      return this.discipuladoresPorIgrejaCargo();
    }
  }

  discipuladoresPorCargo(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipuladoresUrl}/estatisticas/por-cargo`)
    .toPromise();
  }

  discipuladoresPorIgrejaCargo(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipuladoresUrl}/estatisticas/por-igreja-cargo/${this.auth.jwtPayload.codigoIgreja}`)
    .toPromise();
  }

  // Grafico de pizza por cargo ou por cargo da igreja - FIM

  // Grafico de pizza por mês ou por mês da igreja - INICIO
  discipulandosConversoesLocalPorIgrejaPorMes(): Promise<Array<any>> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      return this.discipulandosConversoesLocalPorMes();
    } else {
      return this.discipulandosConversoesLocalPorIgrejaMes();
    }
  }

  discipulandosConversoesLocalPorMes(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-local-mes`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }

  discipulandosConversoesLocalPorIgrejaMes(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-local-igreja-mes/${this.auth.jwtPayload.codigoIgreja}`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }
  // Grafico de pizza por mês ou por mês da igreja - FIM

  // Grafico de pizza por ano ou por ano da igreja - INICIO
  discipulandosConversoesLocalIgrejaPorAno(): Promise<Array<any>> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      return this.discipulandosConversoesLocalPorAno();
    } else {
      return this.discipulandosConversoesLocalPorIgrejaAno();
    }
  }

  discipulandosConversoesLocalPorAno(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-local-ano`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }

  discipulandosConversoesLocalPorIgrejaAno(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-local-igreja-ano/${this.auth.jwtPayload.codigoIgreja}`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }

  // Grafico de pizza por ano ou por ano da igreja - FIM

  // Grafico de linha por mês ou por mês da igreja - INICIO
  discipulandosConversoesPorIgrejaPorMes(): Promise<Array<any>> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      return this.discipulandosConversoesPorMes();
    } else {
      return this.discipulandosConversoesPorIgrejaMes();
    }
  }

  discipulandosConversoesPorMes(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-por-mes`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }

  discipulandosConversoesPorIgrejaMes(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-por-igreja-mes/${this.auth.jwtPayload.codigoIgreja}`)
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }
  // Grafico de linha por mês ou por mês da igreja - FIM

  // Grafico de linha por ano ou por ano da igreja - INICIO
  discipulandosConversoesPorIgrejaAno(dataReferencia: Date): Promise<Array<any>> {
    if (this.auth.temPermissao('ROLE_ADMINISTRADOR')) {
      return this.discipulandosConversoesPorAno(dataReferencia);
    } else {
      return this.discipulandosConversoesIgrejaPorAno(dataReferencia);
    }
  }

  discipulandosConversoesPorAno(dataReferencia: Date): Promise<Array<any>> {
    const params = new HttpParams()
      .append('dataReferencia', moment(dataReferencia).format('YYYY-MM-DD'));

    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-por-ano`, { params })
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }

  discipulandosConversoesIgrejaPorAno(dataReferencia: Date): Promise<Array<any>> {
    const params = new HttpParams()
      .append('dataReferencia', moment(dataReferencia).format('YYYY-MM-DD'));

    return this.http.get<Array<any>>(`${this.discipulandosUrl}/estatisticas/conversoes-igreja-por-ano/${this.auth.jwtPayload.codigoIgreja}`, { params })
    .toPromise()
    .then(responsta => {
      const dados = responsta;
      /* this.converterStringsParaDatas(dados);* */
      return dados;
    });
  }
  // Grafico de linha por ano ou por ano da igreja - FIM

  /* Caso retorne alguma DATA deve transformar conforme abaixo */
  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }

}
