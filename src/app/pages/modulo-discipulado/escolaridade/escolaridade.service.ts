import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EscolaridadeService {

  escolaridadesUrl: string;

  constructor(private http: MoneyHttp) {
    this.escolaridadesUrl = `${environment.apiUrl}/escolaridades`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(`${this.escolaridadesUrl}`).toPromise();
  }
}
