import { TestBed } from '@angular/core/testing';

import { DownloadMediatorService } from './download-mediator.service';

describe('DownloadMediatorService', () => {
  let service: DownloadMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadMediatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
