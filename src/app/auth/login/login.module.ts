import { CheckboxModule } from 'primeng/checkbox';
import {  NbAlertModule,
          NbInputModule,
          NbButtonModule,
          NbCheckboxModule,
          NbToastrModule,
          NbCardModule,
          NbLayoutModule,
          NbIconModule} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxLoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NgxLoginComponent,
  ],
  imports: [

    NbLayoutModule,

    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbToastrModule.forRoot(),
    CommonModule,
    NbCardModule,
    NbIconModule,


    CheckboxModule,
  ],
})
export class LoginModule { }
