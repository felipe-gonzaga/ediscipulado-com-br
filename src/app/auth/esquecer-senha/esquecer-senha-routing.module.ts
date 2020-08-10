import { EsquecerSenhaComponent } from './../../auth/esquecer-senha/esquecer-senha.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: EsquecerSenhaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsquecerSenhaRoutingModule { }
