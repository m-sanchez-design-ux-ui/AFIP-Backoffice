import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICompanyCuil } from 'app/shared/interfaces/filters/company-cuil.interface';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { ICompanyPos } from 'app/shared/interfaces/filters/company-pos.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  _http = inject(HttpClient);
  _configService = inject(ConfigService);

  getCompanyCuil(): Observable<ICompanyCuil> {
    const url = `${this._configService.getProperty(
      'apiUrl'
    )}/v1/companies/cuit`;
    return this._http.get<ICompanyCuil>(url);
  }
  getCompanyPos(id: string): Observable<ICompanyPos> {
    const url = `${this._configService.getProperty(
      'apiUrl'
    )}/v1/pos?CompanyId=${id}`;
    return this._http.get<ICompanyPos>(url);
  }
}
