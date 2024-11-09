import { TestBed } from '@angular/core/testing';

import { CookieSettingsService } from './cookie-settings.service';

describe('CookieSettingsService', () => {
  let service: CookieSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
