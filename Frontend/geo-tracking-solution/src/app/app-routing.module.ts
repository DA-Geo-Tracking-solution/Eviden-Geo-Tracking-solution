import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/guard/auth.guard';
import { CreateUserComponent } from './components/user-group/create-user/create-user.component';
import { UserGroupComponent } from './components/user-group/user-group.component';
import { CreateGroupComponent } from './components/user-group/create-group/create-group.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'create', component: UserGroupComponent, children: [
      { path: 'user', component: CreateUserComponent, data: {width: '100%', maxWidth: '500px'} },
      { path: 'group', component: CreateGroupComponent, data: {width: '100%', maxWidth: '500px'} }
    ]
  },
  {path:'chat', component:ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
