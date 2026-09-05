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
  getMockConsolidatedFiles,
  getMockFileDetail,
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

    // --- Consolidated files (check before the generic /v1/files match) -
    if (path.endsWith('/v1/files/consolidated') && request.method === 'GET') {
      const page = Number(searchParams.get('PageParams.PageNumber') ?? '1');
      const pageSize = Number(searchParams.get('PageParams.PageSize') ?? '5');
      const data = getMockConsolidatedFiles(page, pageSize);
      return this.mockResponse({ results: data });
    }

    // --- Files list -----------------------------------------------------
    if (/\/v1\/files$/.test(path) && request.method === 'GET') {
      const page = Number(searchParams.get('PageParams.PageNumber') ?? '1');
      const pageSize = Number(searchParams.get('PageParams.PageSize') ?? '5');
      const data = paginateFiles(page, pageSize, {
        cuit: searchParams.get('Cuit') ?? undefined,
        status: searchParams.get('Status') ?? undefined,
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
