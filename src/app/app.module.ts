import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HomepageComponent } from './homepage/homepage.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { TaskbarCgComponent } from './taskbar-cg/taskbar-cg.component';
import { TaskbarKsComponent } from './taskbar-ks/taskbar-ks.component';
import { TaskbarQtvComponent } from './taskbar-qtv/taskbar-qtv.component';
import { QtvCgmanageComponent } from './qtv-cgmanage/qtv-cgmanage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmComponent } from './confirm/confirm.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { TaskbarCg0Component } from './taskbar-cg0/taskbar-cg0.component';



const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },

  { path: 'taskbar-qtv', component: TaskbarQtvComponent },
  { path: 'taskbar-cg', component: TaskbarCgComponent },
  { path: 'taskbar-cg0', component: TaskbarCg0Component },
  { path: 'taskbar-ks', component: TaskbarKsComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'diagnosis', component: DiagnosisComponent },
  { path: 'comfirm', component: ConfirmComponent },
  {path: 'forgotpass',component:ForgotpassComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    HomepageComponent,
    DiagnosisComponent,
    TaskbarCgComponent,
    TaskbarKsComponent,
    TaskbarQtvComponent,
    QtvCgmanageComponent,
    ConfirmComponent,
    ForgotpassComponent,
    TaskbarCg0Component
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    ReactiveFormsModule,

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule

  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
