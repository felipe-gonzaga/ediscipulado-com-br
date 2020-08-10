import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: AlterarSenhaComponent },
  { path: 'alterar-senha', component: AlterarSenhaComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AdministradorRoutingModule { }
