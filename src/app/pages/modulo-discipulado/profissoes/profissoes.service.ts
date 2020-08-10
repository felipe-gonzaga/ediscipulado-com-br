import { MoneyHttp } from './../../../auth/money-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfissoesService {

  profissoesUrl: string;

  constructor(private http: MoneyHttp) {
    this.profissoesUrl = `${environment.apiUrl}/profissoes`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(`${this.profissoesUrl}`).toPromise();
  }
}
