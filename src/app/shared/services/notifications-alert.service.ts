import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { MOCK_NOTIFICATIONS } from 'app/shared/mocks/mock-data';

@Injectable({
  providedIn: 'root',
})
export class NotificationsAlertService implements OnDestroy {
  private readonly okToRefresh = new Subject<any>();
  refreshNotifLength = this.okToRefresh.asObservable();
  private httpParams = new HttpParams();
  private readonly subscriptions: Subscription[] = [];
  private readonly batchList!: any[];
  private readonly distributionList!: any[];
  // DEMO NOTE: seeded with fictional notifications so the bell icon isn't
  // empty. This service never actually calls a backend for notifications
  // (it's in-memory + localStorage in the real app too), so no interceptor
  // change was needed for this.
  notifications: any[] = [...MOCK_NOTIFICATIONS];
  private readonly keyBatches = 'batches';
  private readonly keyDistributions = 'distributions';

  private readonly statusSubject = new BehaviorSubject<any[]>([]);
  status = this.statusSubject.asObservable();

  constructor(private readonly httpClient: HttpClient) {
    let batchesSaved = localStorage.getItem(this.keyBatches);
    let distSaved = localStorage.getItem(this.keyDistributions);
    if (batchesSaved) {
      this.batchList = JSON.parse(batchesSaved).batches;
    }
    if (distSaved) {
      this.distributionList = JSON.parse(distSaved).distributions;
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem(
      this.keyBatches,
      JSON.stringify({ batches: this.batchList })
    );

    localStorage.setItem(
      this.keyDistributions,
      JSON.stringify({ distributions: this.distributionList })
    );
  }

  public emitRefreshNotif(data: number) {
    this.okToRefresh.next(data);
  }

  compareStatusDist(oldDistributions: any[], newDistributions: any[]) {
    newDistributions.forEach((dist: any) => {
      const oldDistribution = oldDistributions.find(
        (olDist: any) => olDist.batchCode === dist.batchCode
      );

      if (oldDistribution) {
        if (oldDistribution.status === 1 && dist.status !== 1) {
          this.notifications.unshift({
            code: dist.code,
            status: dist.status,
            description:
              dist.status === 2
                ? `El lote ${dist.batchCode} se distribuyó correctamente`
                : `Ocurrió un error de distribución en el lote ${dist.batchCode}`,
            createdOn: new Date(),
          });
          this.statusSubject.next(this.notifications);
        }
      }
    });
  }

  compareStatusBatch(oldBatches: any[], newBatches: any[]) {
    newBatches.forEach((batch: any) => {
      const oldBatch = oldBatches.find(
        (oldBatch: any) => oldBatch.code === batch.code
      );

      if (oldBatch) {
        if (oldBatch.status === 1 && batch.status !== 1) {
          this.notifications.unshift({
            code: batch.code,
            status: batch.status,
            description:
              batch.status === 2
                ? `El lote ${batch.code} se importó correctamente`
                : `El lote ${batch.code} tuvo un error de importación. Compruebe el detalle del lote`,
            createdOn: new Date(),
          });
          this.statusSubject.next(this.notifications);
        }
      }
    });
  }

  getNotifications() {
    this.httpParams = this.httpParams.set('pageParams.pageSize', 10);

    return this.notifications;
  }

  unsubscribeNotifications() {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  deleteNotifications(notificationCode: string) {
    this.notifications = this.notifications.filter(
      (notification) => notification.code !== notificationCode
    );

    return this.notifications;
  }
}
