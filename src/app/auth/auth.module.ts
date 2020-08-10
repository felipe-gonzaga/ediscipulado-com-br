import { EsquecerSenhaModule } from './esquecer-senha/esquecer-senha.module';
import { LoginModule } from './login/login.module';
import { AuthGuard } from './auth.guard';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    LoginModule,
    EsquecerSenhaModule,
  ],
  declarations: [
  ],
  providers: [
    AuthGuard,
  ],
})
export class AuthModule {
}
