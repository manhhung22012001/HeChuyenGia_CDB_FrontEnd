import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { TaskbarCgComponent } from './taskbar-cg/taskbar-cg.component';
import { TaskbarKsComponent } from './taskbar-ks/taskbar-ks.component';
import { TaskbarQtvComponent } from './taskbar-qtv/taskbar-qtv.component';
import { QtvCgmanageComponent } from './qtv-cgmanage/qtv-cgmanage.component';



const appRoutes: Routes = [
  { path: '', component:HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'taskbar-qtv', component: TaskbarQtvComponent },
  { path: 'taskbar-cg', component: TaskbarCgComponent },
  { path: 'taskbar-ks', component: TaskbarKsComponent },
  { path: 'homepage', component:HomepageComponent }
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    DiagnosisComponent,
    TaskbarCgComponent,
    TaskbarKsComponent,
    TaskbarQtvComponent,
    QtvCgmanageComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    ),
    HttpClientModule,
    FormsModule,
   
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
