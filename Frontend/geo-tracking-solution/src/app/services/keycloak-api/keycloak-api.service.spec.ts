import { TestBed } from '@angular/core/testing';

import { KeycloakApiService } from './keycloak-api.service';

describe('KeycloakApiService', () => {
  let service: KeycloakApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
