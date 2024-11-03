import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ScrollerModule } from 'primeng/scroller';
import { NgScrollbarModule } from 'ngx-scrollbar';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { ConfigurationBarComponent } from './components/configuration-bar/configuration-bar.component';
import { ContactChatComponent } from './components/contact/contact-chat/contact-chat.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { LowerBarComponent } from './components/lower-bar/lower-bar.component';
import { AddChatAlertComponent } from './components/lower-bar/add-chat-alert/add-chat-alert.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ConfigurationBarComponent,
    ContactChatComponent,
    ContactListComponent,
    ContactComponent,
    LowerBarComponent,
    AddChatAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScrollerModule,
    NgScrollbarModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
