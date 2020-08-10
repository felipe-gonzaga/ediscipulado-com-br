import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../../modulo-discipulado/igrejas/igrejas.service';
import { MotivosService } from './../motivos.service';
import { Motivo } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UteisService } from '../../../../@core/utils/uteis.service';

@Component({
  selector: 'motivos-cadastro',
  templateUrl: './motivos-cadastro.component.html',
  styleUrls: ['./motivos-cadastro.component.scss']
})
export class MotivosCadastroComponent implements OnInit {

  motivo = new Motivo();
  igrejas = [];
  loading = false;

  constructor(
    private motivosService: MotivosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    const codigoMotivo = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Motivo');

    if (codigoMotivo) {
      this.loading = true;
      this.carregarMotivo(codigoMotivo);
    }
    this.carregarIgrejas();
  }

  carregarMotivo(codigo: number) {
    this.motivosService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.motivo = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
        this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));
        // Só deixa selecionado o primeiro registro se for uma inclusao
        if (!this.motivo.igreja.codigo) {
          this.motivo.igreja.codigo = this.igrejas[0].value;
        }

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.motivo.igreja.codigo = this.igrejas[0].value;
    }

    this.motivosService.isMotivoJaCadastrado(this.motivo.nome, this.motivo.igreja.codigo)
      .then(response => {
        const resultado = response as boolean;
        if (resultado) {
          this.loading = false;
          this.messageService.showToast('Info', 'O nome do motivo informado já existe.', this.messageService.types[2]);
        } else {
          this.permiteManterMotivo(form);
        }
      });
  }

  permiteManterMotivo(form: FormControl) {
    if (this.editando) {
      this.atualizarMotivo(form);
    } else {
      this.adicionarMotivo(form);
    }
  }

  adicionarMotivo(form: FormControl) {
    this.motivo.ativo = true;
    this.motivosService.adicionar(this.motivo)
      .then(motivoAdicionado => {
        this.loading = false;
        this.messageService.showToast('Sucesso', 'Motivo cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/motivos']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarMotivo(form: FormControl) {
    this.motivo.ativo = true;
    this.motivosService.atualizar(this.motivo)
    .then(response => {
      this.loading = false;
      this.motivo = response;

      this.messageService.showToast('Sucesso', 'Motivo alterado com sucesso.', this.messageService.types[1]);
      this.router.navigate(['/pages/motivos']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.motivo = new Motivo();
    }.bind(this), 1);

    this.router.navigate(['/pages/motivos/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Motivo: ${this.motivo.nome}`);
  }

  // Se existir codigo no motivo é porque é uma edição
  get editando() {
    return this.motivo.codigo;
  }

}
