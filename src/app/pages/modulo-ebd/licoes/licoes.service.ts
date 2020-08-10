import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicoesService {

  licoesUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp
  ) {
    this.licoesUrl = `${environment.apiUrl}/licoes`;
  }

  pesquisar(): Promise<any> {
    return this.http.get<any>(`${this.licoesUrl}?resumo`)
      .toPromise()
      .then();
  }
}
