import { GaficoPizzaLocaisConversoesDiscipulandosPorAnoComponent } from './graficos/grafico-pizza-locais-conversoes-discipulandos-por-ano.component';
import { GaficoLinhaConversoesDiscipulandosComparativoPorAnoComponent } from './graficos/grafico-linha-conversoes-discipulandos-comparativo-por-ano.component';
import { GaficoLinhaConversoesDiscipulandosPorMesComponent } from './graficos/grafico-linha-conversoes-discipulandos-por-mes.component';
import { GaficoPizzaLocaisConversoesDiscipulandosPorMesComponent } from './graficos/grafico-pizza-locais-conversoes-discipulandos-por-mes.component';
import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule } from '@nebular/theme';

import { NgxEchartsModule } from 'ngx-echarts';

import { ChartModule } from 'angular2-chartjs';


import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { GaficoPizzaDiscipuladoresPorCargoComponent } from './graficos/grafico-pizza-discipuladores-por-cargo.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    NgxEchartsModule,

    ChartModule,
    NbIconModule,
  ],
  declarations: [
    DashboardComponent,
    GaficoPizzaLocaisConversoesDiscipulandosPorMesComponent,
    GaficoPizzaLocaisConversoesDiscipulandosPorAnoComponent,
    GaficoPizzaDiscipuladoresPorCargoComponent,
    GaficoLinhaConversoesDiscipulandosPorMesComponent,
    GaficoLinhaConversoesDiscipulandosComparativoPorAnoComponent,
  ],
})
export class DashboardModule { }
