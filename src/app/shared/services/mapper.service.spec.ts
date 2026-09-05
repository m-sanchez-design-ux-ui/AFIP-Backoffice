import { TestBed } from '@angular/core/testing';

import { MapperService } from 'app/shared/services/mapper.service';

describe('MapperService', () => {
  let service: MapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
