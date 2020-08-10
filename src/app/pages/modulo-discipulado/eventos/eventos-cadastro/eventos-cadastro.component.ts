import { ErrorHandlerService } from './../../../../@core/error-handler.service';
import { MessageService } from './../../../../@core/message.service';
import { IgrejasService } from './../../igrejas/igrejas.service';
import { EventosService } from './../eventos.service';
import { UteisService } from '../../../../@core/utils/uteis.service';
import { Evento } from './../../../../@core/mock/model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'eventos-cadastro',
  templateUrl: './eventos-cadastro.component.html',
  styleUrls: ['./eventos-cadastro.component.scss']
})
export class EventosCadastroComponent implements OnInit {
  evento = new Evento();
  igrejas = [];
  loading = false;

  constructor(
    private eventosService: EventosService,
    private igrejasService: IgrejasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private uteis: UteisService,
  ) { }

  ngOnInit() {
    const codigoEvento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Evento');

    if (codigoEvento) {
      this.loading = true;
      this.carregarEvento(codigoEvento);
    }
    this.carregarIgrejas();
  }

  carregarIgrejas() {
    return this.igrejasService.listarPorUsuario()
      .then(igrejas => {
         this.igrejas = igrejas.map(i => ({ name: i.nome, value: i.codigo }));

         this.evento.igreja.codigo = this.igrejas[0].value;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEvento(codigo: number) {
    this.eventosService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.evento = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.loading = true;
    if (this.uteis.tamanholista(this.igrejas) === 1) {
      this.evento.igreja.codigo = this.igrejas[0].value;
    }

    this.eventosService.isEventoJaCadastrado(this.evento.nome, this.evento.igreja.codigo)
    .then(response => {
      const resultado = response as boolean;
      if (resultado) {
        this.loading = false;
        this.messageService.showToast('', 'O nome do evento informado já existe.', this.messageService.types[2]);
      } else {
        this.permiteManterEvento(form);
      }
    });
  }

  permiteManterEvento(form: FormControl) {
    this.evento.ativo = true;

    if (this.editando) {
      this.atualizarEvento(form);
    } else {
      this.adicionarEvento(form);
    }
  }

  adicionarEvento(form: FormControl) {
    this.eventosService.adicionar(this.evento)
      .then(eventoAdicionado => {
        this.loading = false;
        this.messageService.showToast('', 'Evento cadastrado com sucesso.', this.messageService.types[1]);

        this.router.navigate(['/pages/eventos']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarEvento(form: FormControl) {
    this.eventosService.atualizar(this.evento)
    .then(response => {
      this.loading = false;
      this.evento = response;

      this.messageService.showToast('', 'Evento alterado com sucesso.', this.messageService.types[1]);

      this.router.navigate(['/pages/eventos']);

    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.evento = new Evento();
    }.bind(this), 1);

    this.router.navigate(['/pages/eventos/novo']);
  }

  atualizarTituloEdiao() {
    this.title.setTitle(`Edição de Evento: ${this.evento.nome}`);
  }

  // Se existir codigo no evento é porque é uma edição
  get editando() {
    return this.evento.codigo;
  }

}
