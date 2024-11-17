import { TestBed } from '@angular/core/testing';

import { RasterMapService } from './raster-map.service';

describe('RasterMapService', () => {
  let service: RasterMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RasterMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
