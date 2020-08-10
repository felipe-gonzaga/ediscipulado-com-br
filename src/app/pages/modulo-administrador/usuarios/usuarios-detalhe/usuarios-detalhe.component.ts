import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../../../@core/error-handler.service';
import { UsuariosService } from '../usuarios.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../@core/mock/model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'usuarios-detalhe',
  templateUrl: './usuarios-detalhe.component.html',
  styleUrls: ['./usuarios-detalhe.component.scss']
})
export class UsuariosDetalheComponent implements OnInit {

  usuario = new Usuario();
  loading = false;

  constructor(
    private usuarioService: UsuariosService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit() {
    const codigoUsuario = this.route.snapshot.params['codigo'];

    this.title.setTitle('Edição de Usuário');

    if (codigoUsuario) {
      this.loading = true;
      this.carregarUsuario(codigoUsuario);
    }
  }

  carregarUsuario(codigo: number) {
    this.usuarioService.buscarPorCodigo(codigo)
      .then(response => {
        this.loading = false;
        this.usuario = response;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
