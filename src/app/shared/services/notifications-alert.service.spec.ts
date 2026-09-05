import { TestBed } from '@angular/core/testing';
import { NotificationsAlertService } from './notifications-alert.service';

describe('NotificationAlertService', () => {
  let service: NotificationsAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
