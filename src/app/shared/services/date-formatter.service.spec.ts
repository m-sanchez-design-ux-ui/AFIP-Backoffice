import { TestBed } from '@angular/core/testing';

import { DateFormatterService } from 'app/shared/services/date-formatter.service';

describe('DateFormatterService', () => {
  let service: DateFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
