/* Classes do Modulo de Discipulado */
export class Pessoa {
  codigo: number;
  nome: string;
  sexo: string;
  endereco = new Endereco();
  dataNascimento: Date;
  telefones = new Array<Telefone>();
  email: string;
  estadoCivil: string;
  nomeConjuge: string;

  dataInicioVigenciaDiscipulador: Date;
  dataFimVigenciaDiscipulador: Date;
  cargos = new Array<Cargo>();
}

export class Permissao {
  codigo: number;
  decricao: string;
}

export class Igreja {
  codigo: number;
  nome: string;
  sigla: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade = new Cidade();
  email: string;
  site: string;
  nuDocumento: string;
  dataInicioAtividade: Date;
  dataFimAtividade: Date;
  nomeRepresentante: string;
}

export class Usuario {
  codigo: number;
  email: string;
  senha: string;
  permissoes = new Array<Permissao>();
  pessoa = new Pessoa();
  ativo: boolean;
}

export class Telefone {
  prefixo: string;
  numero: string;
  constructor(prefixo?: string, numero?: string) {
    this.prefixo = prefixo;
    this.numero = numero;
  }
}

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade = new Cidade();
}

export class Cidade {
  codigo: number;
  nome: string;
  estado = new Estado();
}

export class Estado {
  codigo: number;
  nome: string;
  sigla: string;
  codigoIBGE: number;
  regiao: string;
  pais = new Pais();
}

export class Pais {
  codigo: number;
  nome: string;
}

export class Cargo {
  codigo: number;
  nome: string;
}

export class Discipulador {
  codigo: number;
  nome: string;
  sexo: string;
  endereco = new Endereco();
  dataNascimento: Date;
  telefones = new Array<Telefone>();
  email: string;
  cpf: string;
  estadoCivil: string;
  nomeConjuge: string;

  dataInicioVigenciaDiscipulador: Date;
  dataFimVigenciaDiscipulador: Date;
  cargos = new Array<Cargo>();
  igreja = new Igreja();
  escolaridade = new Escolaridade();
  profissao = new Profissao();
  conjugeEvangelico: string;
}

export class Discipulando {
  codigo: number;
  nome: string;
  sexo: string;
  endereco = new Endereco();
  dataNascimento: Date;
  telefones = new Array<Telefone>();
  email: string;
  cpf: string;
  estadoCivil: string;
  nomeConjuge: string;
  usuario: Usuario;

  dataBatismo: Date;
  dataConversao: Date;
  dataInicioPeriodoDiscipulado: Date;
  dataFimPeriodoDiscipulado: Date;
  localConversao = new Local();
  eventoConversao = new Evento();
  nomePregadoConversao: string;
  igreja = new Igreja();
  escolaridade = new Escolaridade();
  profissao = new Profissao();
  conjugeEvangelico: string;
  retornandoJesus: string;
  pertenceuIgreja: string;
  nmIgrejaNovoDecidido: string;
  batizado: string;
  batizadoImersao: string;
}

export class Local {
  codigo: number;
  nome: string;
  tipo: string;
  ativo: boolean;
  igreja = new Igreja();
}

export class Evento {
  codigo: number;
  nome: string;
  ativo: boolean;
  igreja = new Igreja();
}

export class Profissao {
  codigo: number;
  nome: string;
}

export class Escolaridade {
  codigo: number;
  nome: string;
}

/* Classes do Modulo de Visitas */
export class Situacao {
  codigo: number;
  descricao: string;
  ativo: boolean;
  igreja = new Igreja();
}

export class Motivo {
  codigo: number;
  nome: string;
  ativo: boolean;
  igreja = new Igreja();
}

export class Visita {
  codigo: number;
  nome: string;
  dhVisita: Date;
  hora: string;
  igreja = new Igreja();
  motivo = new Motivo();
  resumo: string;
  situacoes = new Array<Situacao>();
  discipuladores = new Array<Discipulador>();
  discipulandos = new Array<Discipulando>();
}

/* Classes do Modulo de E.B.D */
export class Classe {
  codigo: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  igreja = new Igreja();
  licoes = new Array<Licao>();
}

export class Licao {
  codigo: number;
  nome: string;
  numero: number;
  descricao: string;
  ativo: boolean;
  ciclo: Ciclo;
}

export class Ciclo {
  codigo: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export class LicaoAdicional {
  codigo: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  igreja = new Igreja();
}

export class Aluno {
  codigo: number;
  nome: string;
}

export class Professor {
  codigo: number;
  nome: string;
}

export class Matricula {
  codigo: number;
  aluno = new Aluno();
  classe = new Classe();
  igreja = new Igreja();
  dtMatricula: Date;
  dtEncerramento: Date;
  descricao: string;
}

export class Aula {
  codigo: number;
  classe = new Classe();
  licao = new Licao();
  professor = new Professor();
  licaoAdicional = new LicaoAdicional();
  nmProfessorLicaoAdicional: string;
  dtAula: Date;
  avaliacao: boolean;
  descricao: string;
}

export class Frequencia {
  codigo: number;
  aluno = new Aluno();
  aula = new Aula();
  dtAula: Date;
  decricao: string;
}
