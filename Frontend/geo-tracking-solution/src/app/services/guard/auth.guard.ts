
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakApiService } from '../keycloak-api/keycloak-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(KeycloakApiService);
  // Todo the authServices cant be injected 
  const router = inject(Router);
    
  return true;
};