import { DashboardService } from './../dashboard.service';
import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'grafico-pizza-discipuladores-por-cargo',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class GaficoPizzaDiscipuladoresPorCargoComponent implements OnDestroy {

  options: any = {};
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private dashboardService: DashboardService,
    ) {
    this.graficoPizzaDiscipuladoresPorCargo();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  graficoPizzaDiscipuladoresPorCargo() {

    this.dashboardService.discipuladoresIgrejaPorCargo()
    .then(dados => {
        /* Inicio configuraçao grafico */
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors = config.variables;
          const echarts: any = config.variables.echarts;
        this.options = {
          backgroundColor: echarts.bg,
          color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: dados.map(d => d.nomeCargo),
            textStyle: {
              color: echarts.textColor,
            },
          },
          series: [
            {
              name: 'Cargo',
              type: 'pie',
              radius: '80%',
              center: ['50%', '50%'],
              data: dados.map(d => ({ value: d.quantidade, name: d.nomeCargo })),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: echarts.itemHoverShadowColor,
                },
              },
              label: {
                normal: {
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
              },
            },
          ],
        };
        });
        /* Fim configuração grafico */
    });
  }

}
