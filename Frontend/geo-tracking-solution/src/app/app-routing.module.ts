import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:  [ authGuard ]},
  { path: 'login', component: LoginComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
