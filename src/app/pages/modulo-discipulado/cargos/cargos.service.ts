import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargosService {

  cargosUrl: string;

  constructor(private http: MoneyHttp) {
    this.cargosUrl = `${environment.apiUrl}/cargos`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(`${this.cargosUrl}`).toPromise();
  }
}
