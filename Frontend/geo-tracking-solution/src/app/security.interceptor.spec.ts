import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KeycloakInterceptor } from './security.interceptor';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('KeycloakInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let keycloakService: jasmine.SpyObj<KeycloakService>;

  const mockToken = 'mocked-token';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('KeycloakService', ['keycloak']);
    spy.keycloak = { token: mockToken };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: KeycloakService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: KeycloakInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    keycloakService = TestBed.inject(KeycloakService) as jasmine.SpyObj<KeycloakService>;
  });

  afterEach(() => {
    httpMock.verify();
  });
});
