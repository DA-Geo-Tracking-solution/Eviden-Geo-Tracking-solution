import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/guard/auth.guard';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UserComponent } from './components/settings/user/user.component';
import { ChangeLanguageComponent } from './components/settings/change-language/change-language.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: CreateUserComponent },
  { path: 'settings', component: SettingsComponent, children: [
    {path: 'user', component: UserComponent},
    {path: 'language', component: ChangeLanguageComponent}
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
