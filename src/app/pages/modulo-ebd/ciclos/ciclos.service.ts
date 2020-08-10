import { MoneyHttp } from './../../../auth/money-http';
import { AuthService } from './../../../auth/auth.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CiclosService {

  ciclosUrl: string;

  constructor(
    public auth: AuthService,
    private http: MoneyHttp
  ) {
    this.ciclosUrl = `${environment.apiUrl}/licoes`;
  }

  pesquisar(): Promise<any> {
    return this.http.get<any>(`${this.ciclosUrl}`)
      .toPromise()
      .then();
  }
}
