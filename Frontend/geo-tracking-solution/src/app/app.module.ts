import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ScrollerModule } from 'primeng/scroller';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { ConfigurationBarComponent } from './components/configuration-bar/configuration-bar.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { CreateUserComponent } from './components/user-group/create-user/create-user.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { UserGroupComponent } from './components/user-group/user-group.component';
import { CreateGroupComponent } from './components/user-group/create-group/create-group.component';


import { ContactChatComponent } from './components/contact/contact-chat/contact-chat.component';
import { ContactListComponent } from './components/contact/contact-list/contact-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { LowerBarComponent } from './components/lower-bar/lower-bar.component';
import { AddChatAlertComponent } from './components/lower-bar/add-chat-alert/add-chat-alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamComponent } from './components/home/team/team.component';
import { AboutTheProjectComponent } from './components/home/about-the-project/about-the-project.component';


export function kcFactory(KeycloakService: KeycloakService) {
  return () => KeycloakService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ConfigurationBarComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    CreateUserComponent,
    UserGroupComponent,
    CreateGroupComponent,
    ContactChatComponent,
    ContactListComponent,
    ContactComponent,
    LowerBarComponent,
    AddChatAlertComponent,
    TeamComponent,
    AboutTheProjectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScrollerModule,
    NgScrollbarModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
