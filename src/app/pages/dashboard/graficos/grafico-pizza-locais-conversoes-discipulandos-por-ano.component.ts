import { DashboardService } from './../dashboard.service';
import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'grafico-pizza-locais-conversoes-discipulandos-por-ano',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class GaficoPizzaLocaisConversoesDiscipulandosPorAnoComponent implements OnDestroy {

  options: any = {};
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private dashboardService: DashboardService,
    ) {
    this.graficoPizzaLocaisConversoesDiscipulandosPorAno();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  graficoPizzaLocaisConversoesDiscipulandosPorAno() {

    this.dashboardService.discipulandosConversoesLocalIgrejaPorAno()
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
            data: dados.map(d => d.nmLocal),
            textStyle: {
              color: echarts.textColor,
            },
          },
          series: [
            {
              name: 'Local',
              type: 'pie',
              radius: '80%',
              center: ['50%', '50%'],
              data: dados.map(d => ({ value: d.total, name: d.nmLocal })),
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
