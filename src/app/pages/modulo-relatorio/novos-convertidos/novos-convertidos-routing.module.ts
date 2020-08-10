import { NovosConvertidosEmitirComponent } from './novos-convertidos-emitir/novos-convertidos-emitir.component';
import { AuthGuard } from './../../../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



const routes: Routes = [
  {
    path: '',
    component: NovosConvertidosEmitirComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DISCIPULANDO'] },
  },
];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class NovosConvertidosRoutingModule { }
