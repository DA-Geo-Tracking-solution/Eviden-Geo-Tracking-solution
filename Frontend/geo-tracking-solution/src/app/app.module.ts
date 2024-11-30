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
import { LowerBarComponent } from './components/contact/contact-list/lower-bar/lower-bar.component';
import { AddChatAlertComponent } from './components/contact/contact-list/lower-bar/add-chat-alert/add-chat-alert.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MapComponent } from './components/map/map.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MapTableComponent } from './components/map-table/map-table.component';
import { SplitterModule } from 'primeng/splitter';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { WebsocketComponent } from './components/websocket/websocket/websocket.component';


export function kcFactory(KeycloakService: KeycloakService) {
  return () => KeycloakService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ConfigurationBarComponent,
    MapComponent,
    MapTableComponent,
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
    WebsocketComponent
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
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    SplitterModule,
    MatSortModule,
    MatTableModule,
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
