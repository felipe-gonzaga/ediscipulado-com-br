export class ResumoLicao {
  codigo: number;
  nome: string;
  numeroLicao: number;
  codigoCiclo: number;
  nomeCiclo: string;
}

export class ResumoDiscipulador {
  codigo: number;
  nome: string;
  dataNascimento: Date;
  email: string;
  sexo: string;
  dataInicioVigencia: Date;
  dataFimVigencia: Date;
  cargo: string;
}

export class ResumoDiscipulando {
  codigo: number;
  nome: string;
  dataNascimento: Date;
  email: string;
  estadoCivil: string;
  dataConversao: Date;
  siglaIgrejaDiscipulando: string;
  localConversao: string;
  eventoConversao: string;
}

export class ResumoMatricula {
  codigo: number;
  cdAluno: number;
  nmAluno: string;
  cdIgreja: number;
  nmIgreja: string;
  sgIgreja: string;
  cdClasse: number;
  nmClasse: string;
  dtMatricula: Date;
  dtEncerramento: Date;
}

export class ResumoAula {
  codigo: number;
  dtAula: Date;
  inAvaliaAula: boolean;
  dsAula: string;
  cdClasse: number;
  nmClasse: string;
  cdIgreja: number;
  nmIgreja: string;
  sgIgreja: string;
  cdLicao: number;
  nmLicao: string;
  cdCiclo: number;
  nmCiclo: string;
  cdProfessor: number;
  nmProfessor: string;
  cdLicaoAdicional: number;
  nmLicaoAdicional: string;
  nmProfessorLicaoAdicional: string;
}
