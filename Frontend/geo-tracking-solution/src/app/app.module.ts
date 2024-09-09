import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { ConfigurationBarComponent } from './configuration-bar/configuration-bar.component';
import { ContactChatComponent } from './contact-chat/contact-chat.component';
import { ContactListComponent } from './contact-list/contact-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ConfigurationBarComponent,
    ContactChatComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
