import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from './services/keycloak/keycloak.service';

@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.keycloakService.keycloak?.token;

    if (token) {
      const clonedRequest = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`, 
        })
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
