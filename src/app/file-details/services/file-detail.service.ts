import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from 'app/shared/services/config.service';
import { IFileDetail } from '../interfaces/file-detail.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileDetailService {
  _http = inject(HttpClient);
  _configService = inject(ConfigService);

  getFileDetail = (fileId: string): Observable<IFileDetail> => {
    const url = `${this._configService.getProperty(
      'apiUrl'
    )}/v1/files/${fileId}`;
    return this._http.get<IFileDetail>(url);
  };
}
