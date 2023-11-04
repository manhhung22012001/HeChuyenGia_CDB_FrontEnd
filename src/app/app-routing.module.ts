import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  { path: '', component: LoginComponent } // Define LoginComponent as the default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
