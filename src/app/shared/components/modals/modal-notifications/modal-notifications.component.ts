import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalsFrameComponent } from '../modals-frame/modals-frame.component';
import { interval, Subscription } from 'rxjs';
import { NotificationsAlertService } from 'app/shared/services/notifications-alert.service';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-modal-notifications',
  standalone: true,
  imports: [ModalsFrameComponent, FeatherModule],
  templateUrl: './modal-notifications.component.html',
})
export class ModalNotificationsComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  public showNotifications: string | undefined;
  public notifications: any[] = [];
  public notifLength: number | undefined;
  private readonly keyNotifications = 'notifications';

  constructor(
    private readonly notificationsAlertService: NotificationsAlertService
  ) {
    const notifSave = localStorage.getItem(this.keyNotifications);

    if (notifSave) {
      JSON.parse(notifSave).notification.forEach((element: any) => {
        this.notifications.push(element);
      });

      localStorage.setItem(
        this.keyNotifications,
        JSON.stringify({ notification: this.notifications })
      );
    }
  }

  ngOnInit() {
    this.showNotifications = 'notifications-loading';

    this.subNotificationsStatus();

    this.getNotif();

    this.subscriptions.push(
      interval(60000).subscribe(() => {
        this.getNotif();
      })
    );
  }

  private getNotifStorage() {
    const notifSave: any = localStorage.getItem(this.keyNotifications);

    if (notifSave) {
      const aux = [
        ...this.notifications,
        ...JSON.parse(notifSave).notification,
      ];

      this.notifications = aux.filter(
        (obj, index, self) =>
          index === self.findIndex((o) => o.code === obj.code)
      );

      localStorage.setItem(
        this.keyNotifications,
        JSON.stringify({ notification: this.notifications })
      );
    } else {
      localStorage.setItem(
        this.keyNotifications,
        JSON.stringify({ notification: this.notifications })
      );
    }
  }

  private actualizeNotif() {
    this.notifLength = this.notifications.length;

    this.notificationsAlertService.emitRefreshNotif(this.notifLength);

    if (this.notifications.length === 0) {
      this.showNotifications = 'notifications-false';
    } else {
      this.showNotifications = 'notifications-true';
    }
  }

  private subNotificationsStatus() {
    this.subscriptions.push(
      this.notificationsAlertService.status.subscribe((notif: any[]) => {
        this.notifications = notif;

        this.getNotifStorage();

        this.actualizeNotif();
      })
    );
  }

  private getNotif() {
    this.notifications = this.notificationsAlertService.getNotifications();

    this.getNotifStorage();

    this.actualizeNotif();
  }

  public getClass(status: number) {
    return status === 2
      ? 'bg-green-100 [&_i-feather]:text-green-800'
      : 'bg-red-100 [&_i-feather]:text-red-800 ';
  }
  public getNameIcon(status: number) {
    return status === 2 ? 'check' : 'x';
  }

  public timeElapsed(itemDate: string) {
    const notifDate = new Date(itemDate).getTime();
    const now = new Date().getTime();
    let timeElapsed = '';

    const diff = now - notifDate;

    const diffInDays = Math.trunc(diff / (1000 * 60 * 60 * 24));
    const diffInHours = Math.trunc(diff / (1000 * 60 * 60));
    const diffInMinutes = Math.trunc(diff / (1000 * 60));

    if (diffInMinutes === 0) {
      timeElapsed = 'ahora';
    } else if (diffInMinutes < 60) {
      timeElapsed =
        diffInMinutes === 1
          ? diffInMinutes.toLocaleString() + ' minuto'
          : diffInMinutes.toLocaleString() + ' minutos';
    } else if (diffInMinutes > 60 && diffInHours < 24) {
      timeElapsed =
        diffInHours === 1
          ? diffInHours.toLocaleString() + ' hora'
          : diffInHours.toLocaleString() + ' horas';
    } else if (diffInHours > 24) {
      timeElapsed =
        diffInDays === 1
          ? diffInDays.toLocaleString() + ' día'
          : diffInDays.toLocaleString() + ' días';
    }
    return timeElapsed;
  }

  public deleteNotif(notificationCode: string) {
    this.notifications =
      this.notificationsAlertService.deleteNotifications(notificationCode);

    localStorage.setItem(
      this.keyNotifications,
      JSON.stringify({ notification: this.notifications })
    );

    this.actualizeNotif();
  }

  ngOnDestroy(): void {
    this.notificationsAlertService.unsubscribeNotifications();
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
