import { Injectable } from '@angular/core';

@Injectable()
export class UteisService {
  /**
   * O método retorna o tamanho de uma lista que passada como parâmetro
   * @param lista
   */
  tamanholista(lista: any): any {
    if (lista == null) {
      return 0;
    } else {
      return lista.length;
    }
  }

  saoIguais(objetoA, objetoB) {
    // Busca as chaves do objetoA e objetoB
    // utilizando o "let" o escopo da variável é limitado para o bloco.
    // Object.keys retornará um array com todas as chaves do objeto.
    let aChaves = Object.keys(objetoA),
        bChaves = Object.keys(objetoB);

    // Compara os tamanhos, se forem diferentes retorna falso pois
    // o numero de propriedades é diferente, logo os objetos são diferentes
    if (aChaves.length != bChaves.length) {
        return false;
    }

    // Verifico se existe algum elemento com valor diferente nos objetos.
    // o array.some executa uma função(passada por parâmetro) para cada valor
    // do array. Essa função deve executar um teste, se para algum dos valores
    // o teste é verdadeiro, a execução é interrompida e true é retornado.
    // Do contrário, se o teste nunca for verdadeiro ele retornará false
    // após executar o teste para todos valores do array.
    // Estou basicamente verficando se existe diferença entre dois valores do objeto.

    let saoDiferentes = aChaves.some((chave) => {
        return objetoA[chave] !== objetoB[chave];
    });

    // como saoDiferentes contém true caso os objetos sejam diferentes eu
    // simplesmente nego esse valor para retornar que os objetos são iguais (ou não).
    return !saoDiferentes;
  }

  /*
    Métodos utilizados nos graficos DASHBOARD
  */
 public totaisPorCadaDiaMes(dados, diasDoMes) {
  const totais: number[] = [];
  for (const dia of diasDoMes) {
    let total = 0;

    for (const dado of dados) {
      if (dado.dia === dia) {
        total = dado.total;

        break;
      }
    }

    totais.push(total);
  }

  return totais;
}

public configurarDiasMes() {
  const mesReferencia = new Date();
  mesReferencia.setMonth(mesReferencia.getMonth() + 1);
  mesReferencia.setDate(0);

  const quantidade = mesReferencia.getDate();

  const dias: number[] = [];

  for (let i = 1; i <= quantidade; i++) {
    dias.push(i);
  }

  return dias;
}

public configurarMesesAno() {
  const meses: string [] = [];

  meses.push('Jan');
  meses.push('Fev');
  meses.push('Mar');
  meses.push('Abr');
  meses.push('Mai');
  meses.push('Jun');
  meses.push('Jul');
  meses.push('Ago');
  meses.push('Set');
  meses.push('Out');
  meses.push('Nov');
  meses.push('Dez');

  return meses;
}

public totaisPorCadaMesAno(dados, meses) {
  const totais: number[] = [];
  let i = 1;
  for (const mes of meses) {
    let total = 0;
    for (const dado of dados) {
      if (dado.mes.toString() === i.toString()) {
        total = dado.total;

        break;
      }
    }

    totais.push(total);
    i++;
  }

  return totais;
}

public getMesReferencia() {
  return this.getDescricaoMes(new Date().getMonth().toString());
}

public getAnoReferencia() {
  return Number.parseInt(new Date().getFullYear().toString());
}

public getDescricaoMes(mesReferencia: string) {
  const meses: string [] = [];
  let mesRetorno: string;

  meses.push('Janeiro');
  meses.push('Fevereiro');
  meses.push('Março');
  meses.push('Abril');
  meses.push('Maio');
  meses.push('Junho');
  meses.push('Julho');
  meses.push('Agosto');
  meses.push('Setembro');
  meses.push('Outubro');
  meses.push('Novembro');
  meses.push('Dezembro');

  let mesInt = 0;

  for (const mes of meses) {
    if (mesReferencia === mesInt.toString()) {
      mesRetorno = mes;
      break;
    }
    mesInt++;
  }

  return mesRetorno;
}

}
