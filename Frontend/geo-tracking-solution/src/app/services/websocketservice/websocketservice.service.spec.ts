import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocketservice.service';

describe('WebsocketserviceService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
