/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';

@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet>
            <p-confirmDialog header="Confirmação" icon="fa fa-question-circle" width="425" #confirmacao >
            <p-footer>
              <button type="button" pButton icon="fa fa-check" label="Sim" (click)="confirmacao.accept()"></button>
              <button type="button" pButton icon="fa fa-times" label="Não" (click)="confirmacao.reject()"></button>
            </p-footer>
          </p-confirmDialog>`,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }
}
