import { inject, Injectable } from '@angular/core';
import { ConfigService } from 'app/shared/services/config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IFileByIDResponse } from '../interface/file-by-id.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  _configService = inject(ConfigService);
  _httpClient = inject(HttpClient);

  getFilesUrl(): string {
    return `${this._configService.getProperty('apiUrl')}/v1/files`;
  }

  getFileByIdUrl(id: string): Observable<IFileByIDResponse> {
    return this._httpClient.get<IFileByIDResponse>(
      `${this._configService.getProperty('apiUrl')}/v1/files/${id}`
    );
  }
}
