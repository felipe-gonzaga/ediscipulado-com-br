import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  estadosUrl: string;

  constructor(private http: MoneyHttp) {
    this.estadosUrl = `${environment.apiUrl}/estados`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(`${this.estadosUrl}`).toPromise();
  }
}
