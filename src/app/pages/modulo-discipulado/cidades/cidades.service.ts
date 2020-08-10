import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CidadesService {

  cidadesUrl: string;

  constructor(private http: MoneyHttp) {
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
  }

  listarCidadesPorEstado(codigo: number): Promise<any> {
    return this.http.get(`${this.cidadesUrl}/${codigo}`).toPromise();
  }
}
