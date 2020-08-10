import { AuthGuard } from './../../../auth/auth.guard';
import { FichaNovoConvertidoEmitirComponent } from './ficha-novo-convertido-emitir/ficha-novo-convertido-emitir.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: FichaNovoConvertidoEmitirComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULANDO'] },
  },
];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class FichaNovoConvertidoRoutingModule { }
