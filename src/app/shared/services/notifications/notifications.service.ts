import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { INotification } from 'app/shared/interfaces/notifications-models/notification-interface';
import { INotificationCommand } from 'app/shared/interfaces/notifications-models/notification-interface-command';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly notificationSubject: Subject<INotificationCommand>;
  public notificationState: Observable<INotificationCommand>;

  constructor() {
    this.notificationSubject = new Subject<INotificationCommand>();
    this.notificationState = this.notificationSubject.asObservable();
  }

  public show(notification: INotification) {
    this.notificationSubject.next({
      operation: 'show',
      notification,
    });
  }

  public clear() {
    this.notificationSubject.next({
      operation: 'clear',
      notification: undefined,
    });
  }
}
