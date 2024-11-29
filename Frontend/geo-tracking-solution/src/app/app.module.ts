import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { ConfigurationBarComponent } from './components/configuration-bar/configuration-bar.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { WebsocketComponent } from './components/websocket/websocket/websocket.component';

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
    WebsocketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
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
