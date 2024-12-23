import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard, groupmasterGuard } from './services/guard/auth.guard';
import { CreateUserComponent } from './components/user-group/create-user/create-user.component';
import { UserGroupComponent } from './components/user-group/user-group.component';
import { CreateGroupComponent } from './components/user-group/create-group/create-group.component';
import { ChatComponent } from './components/chat/chat.component';
import { MapTableComponent } from './components/map-table/map-table.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  //{ path: 'login', component: LoginComponent },
  {
    path: 'create', component: UserGroupComponent, canActivate: [authGuard], children: [
      { path: 'user', component: CreateUserComponent, data: { width: '100%', maxWidth: '500px' }, canActivate: [authGuard] },
      { path: 'group', component: CreateGroupComponent, data: { width: '100%', maxWidth: '500px' }, canActivate: [authGuard, groupmasterGuard] }
    ]
  },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'map', component: MapTableComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
