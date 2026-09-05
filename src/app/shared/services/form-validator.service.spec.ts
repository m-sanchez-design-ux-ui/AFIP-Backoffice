import { TestBed } from '@angular/core/testing';
import { MustMatch } from 'app/shared/services/form-validator.service';

describe('FormValidatorService', () => {
  let service: typeof MustMatch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MustMatch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
