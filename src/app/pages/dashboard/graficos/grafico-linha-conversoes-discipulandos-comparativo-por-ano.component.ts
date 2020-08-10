import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { DashboardService } from '../dashboard.service';
import { Component, OnDestroy } from '@angular/core';
import { UteisService } from '../../../@core/utils/uteis.service';


@Component({
  selector: 'grafico-linha-conversoes-discipulandos-comparativo-por-ano',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class GaficoLinhaConversoesDiscipulandosComparativoPorAnoComponent implements OnDestroy {

  data: any;
  options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private dashboardService: DashboardService,
    private uteis: UteisService,
    ) {
    this.graficoLinhaConversoesDiscipulandosComparativoPorAno();
  }

  ngOnDestroy(): void {
  }

  graficoLinhaConversoesDiscipulandosComparativoPorAno() {
     /* Ano Passado */
     const dataAnoPassadoReferencia = new Date();
     let totaisMesesAnoPassado: any;
     dataAnoPassadoReferencia.setFullYear(dataAnoPassadoReferencia.getFullYear() - 1);

     this.dashboardService.discipulandosConversoesPorIgrejaAno(dataAnoPassadoReferencia)
       .then(dados => {
         const mesesAno = this.uteis.configurarMesesAno();
         totaisMesesAnoPassado = this.uteis.totaisPorCadaMesAno(dados, mesesAno);
       });

     /* Ano corrente */
     const dataAnoReferencia = new Date()

    this.dashboardService.discipulandosConversoesPorIgrejaAno(dataAnoReferencia)
    .then(dados => {
      const mesesAno = this.uteis.configurarMesesAno();
      const totaisMesesAno = this.uteis.totaisPorCadaMesAno(dados, mesesAno);

      /* Inicio da configuração do relatorio */
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const chartjs: any = config.variables.chartjs;

        this.data = {
          labels: mesesAno,
          datasets: [
            {
            label: dataAnoPassadoReferencia.getFullYear(),
            data: totaisMesesAnoPassado,
            backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
            borderColor: colors.primary,
          }, {
            label: dataAnoReferencia.getFullYear(),
            data: totaisMesesAno,
            backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
            borderColor: colors.danger,
          }, /*{
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
                const dataset = data.datasets[tooltipItem[0].datasetIndex];
                const labelAno = dataset.label ? (dataset.label + ':') : '';
                const mes = tooltipItem[0].xLabel;

                return mes + ' de ' + labelAno;
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
