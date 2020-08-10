import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { DashboardService } from '../dashboard.service';
import { Component, OnDestroy } from '@angular/core';
import { UteisService } from '../../../@core/utils/uteis.service';


@Component({
  selector: 'grafico-linha-conversoes-discipulandos-por-mes',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class GaficoLinhaConversoesDiscipulandosPorMesComponent implements OnDestroy {

  data: any;
  options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private dashboardService: DashboardService,
    private uteis: UteisService,
    ) {
    this.graficoLinhaConversoesDiscipulandosPorMes();
  }

  ngOnDestroy(): void {
  }

  graficoLinhaConversoesDiscipulandosPorMes() {
    this.dashboardService.discipulandosConversoesPorIgrejaPorMes()
    .then(dados => {
     const diasDoMes = this.uteis.configurarDiasMes();
     const totais = this.uteis.totaisPorCadaDiaMes(dados, diasDoMes);

      /* Inicio da configuração do relatorio */
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const chartjs: any = config.variables.chartjs;

        this.data = {
          labels: this.uteis.configurarDiasMes(),
          datasets: [{
            data: totais,
            label: 'Discipulando',
            backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
            borderColor: colors.primary,
          }/*, {
            data: [28, 48, 40, 19, 86, 27, 90],
            label: 'Series B',
            backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
            borderColor: colors.danger,
          }, {
            data: [18, 48, 77, 9, 100, 27, 40],
            label: 'Series C',
            backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
            borderColor: colors.info,
          },*/
          ],
        };

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          // label que aparece quando passa o mouse no grafico
          tooltips: {
            callbacks: {
              title: (tooltipItem, data) => {
                const dia = tooltipItem[0].xLabel;

                return 'Dia ' + dia;
              },
              label: (tooltipItem, data) => {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                const valor = dataset.data[tooltipItem.index];
                const label = dataset.label ? (dataset.label + ':') : '';

                return valor + ' conversão';
              }
            }
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontColor: chartjs.textColor,
            },
          },
        };
      });
      /* Fim da configuração do relatorio */
    });
  }

}
