import { TestBed } from '@angular/core/testing';

import { VectorMapService } from './vector-map.service';

describe('VectorMapService', () => {
  let service: VectorMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
