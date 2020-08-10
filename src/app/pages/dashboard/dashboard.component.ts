import { AuthService } from './../../auth/auth.service';
import { UteisService } from '../../@core/utils/uteis.service';
import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  options: any = {};
  themeSubscription: any;

  constructor(
    private uteis: UteisService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    ) {
      this.title.setTitle('Dashboard');
  }

  ngOnDestroy(): void {
  }

  getMesReferencia() {
    return this.uteis.getMesReferencia();
  }

  getAnoReferencia() {
    return this.uteis.getAnoReferencia();
  }

  paginaNovoConvertido() {
    this.router.navigate(['pages/discipulandos/novo-simples']);
  }
}
