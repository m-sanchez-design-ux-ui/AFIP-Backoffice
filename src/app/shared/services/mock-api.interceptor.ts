import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  getMockCompanyPos,
  getMockConsolidatedFiles,
  getMockFileDetail,
  MOCK_COMPANIES,
  paginateFiles,
} from 'app/shared/mocks/mock-data';

// ---------------------------------------------------------------------------
// DEMO MOCK API INTERCEPTOR
// ---------------------------------------------------------------------------
// This interceptor exists only in this portfolio-demo fork of the project.
// The real project talks to a private backend that this demo has no access
// to, so every request below is answered locally with fictional data,
// simulating the real API's shape so the UI behaves the same way it does
// in production.
// ---------------------------------------------------------------------------

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const path = request.url.split('?')[0];
    const params = request.urlWithParams.split('?')[1] ?? '';
    const searchParams = new URLSearchParams(params);

    // NOTE: the real app lowercases custom filter param names before
    // sending them (see DatatablesService.getData -> httpParams['updates']
    // loop), e.g. 'Cuit' is actually sent as 'cuit'. ASP.NET model binding
    // is case-insensitive so the real backend doesn't care, but a plain
    // URLSearchParams lookup does — so filter params are read
    // case-insensitively here via `getParam`. Params NOT built through
    // that path (PageParams.PageNumber/PageSize, search) keep their
    // original casing and are read directly.
    const getParam = (name: string): string | undefined => {
      const target = name.toLowerCase();
      let found: string | undefined;
      searchParams.forEach((value, key) => {
        if (key.toLowerCase() === target) found = value;
      });
      return found;
    };

    // --- Auth ---------------------------------------------------------
    if (path.endsWith('/v1/auth/login') && request.method === 'POST') {
      return this.mockResponse({
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token',
      });
    }

    if (path.endsWith('/v1/auth/refresh') && request.method === 'POST') {
      return this.mockResponse({
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token',
      });
    }

    if (path.endsWith('/v1/auth/logout') && request.method === 'POST') {
      return this.mockResponse({});
    }

    if (path.endsWith('/v1/auth/change-password') && request.method === 'POST') {
      return this.mockResponse({});
    }

    if (path.endsWith('/v1/users/forgot-password') && request.method === 'POST') {
      return this.mockResponse({});
    }

    if (path.endsWith('/v1/users/reset-password') && request.method === 'POST') {
      return this.mockResponse({});
    }

    // --- Filter dropdowns (CUIT autocomplete + dependent point of sale) -
    if (path.endsWith('/v1/companies/cuit') && request.method === 'GET') {
      return this.mockResponse({ results: MOCK_COMPANIES });
    }

    if (/\/v1\/pos$/.test(path) && request.method === 'GET') {
      const companyId = getParam('CompanyId') ?? '1';
      return this.mockResponse({ results: getMockCompanyPos(companyId) });
    }

    // --- Consolidated files (check before the generic /v1/files match) -
    if (path.endsWith('/v1/files/consolidated') && request.method === 'GET') {
      const page = Number(searchParams.get('PageParams.PageNumber') ?? '1');
      const pageSize = Number(searchParams.get('PageParams.PageSize') ?? '5');
      const data = getMockConsolidatedFiles(page, pageSize, {
        name: getParam('Name'),
        startDate: getParam('StartDate'),
        endDate: getParam('EndDate'),
      });
      return this.mockResponse({ results: data });
    }

    // --- Files list -----------------------------------------------------
    if (/\/v1\/files$/.test(path) && request.method === 'GET') {
      const page = Number(searchParams.get('PageParams.PageNumber') ?? '1');
      const pageSize = Number(searchParams.get('PageParams.PageSize') ?? '5');
      const data = paginateFiles(page, pageSize, {
        cuit: getParam('Cuit'),
        posId: getParam('PosId'),
        status: getParam('Status'),
        search: searchParams.get('search') ?? undefined,
      });
      return this.mockResponse({ results: data });
    }

    // --- File detail ------------------------------------------------------
    const detailMatch = path.match(/\/v1\/files\/([^/]+)$/);
    if (detailMatch && request.method === 'GET') {
      const fileId = detailMatch[1];
      return this.mockResponse(getMockFileDetail(fileId));
    }

    // Anything not explicitly mocked above falls through to the real
    // HTTP pipeline (useful if this fork is later pointed at a real API).
    return next.handle(request);
  }

  private mockResponse<T>(body: T): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(400));
  }
}
