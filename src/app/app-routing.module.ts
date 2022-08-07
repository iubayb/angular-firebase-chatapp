import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {canActivate, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectUnAuth = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
    ...canActivate(redirectUnAuth)
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
