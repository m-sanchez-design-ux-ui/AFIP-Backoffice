import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadMediatorService {
  private readonly okToDownload = new Subject<any>();

  downloadedData = this.okToDownload.asObservable();

  constructor() {}

  public emitOkToDownload(data: any) {
    if (data) {
      this.okToDownload.next(data);
    }
  }
}
