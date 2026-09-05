import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from 'app/shared/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class ConsolidatedFilesService {
  _configService = inject(ConfigService);
  _httpClient = inject(HttpClient);

  getFilesConsolidatedUrl(): string {
    return `${this._configService.getProperty('apiUrl')}/v1/files/consolidated`;
  }
}
