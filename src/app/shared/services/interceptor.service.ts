import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SignInService } from 'app/auth/services/sign-in.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private readonly refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private readonly _SignInService: SignInService, private readonly router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token')) {
      request = this.addToken(request, localStorage.getItem('token')!);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 409) {
          return throwError(() => error);
        } else if (error instanceof HttpErrorResponse && error.status === 404) {
          this.router.navigate(['/404']);
          return throwError(() => error);
        } else if (error instanceof HttpErrorResponse && error.status === 401) {
          if (request.body?.hasOwnProperty('refreshToken')) {
            return this.handle401RefreshError(request, next);
          }
          return this.handle401Error(request, next);
        } else {
          this.router.navigate(['/500']);
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.refreshTokenSubject.next(null);

      return this._SignInService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError((error: any) => {
          localStorage.clear();
          this.router.navigate(['/auth/signin']);
          return of(error);
        })
      );
    } else {
      this.isRefreshing = false;

      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private handle401RefreshError(request: HttpRequest<any>, next: HttpHandler) {
    this.refreshTokenSubject.next(null);
    let refreshCount = parseInt(localStorage.getItem('refreshCount')!);

    if (refreshCount < 2) {
      refreshCount += 1;
      localStorage.setItem('refreshCount', refreshCount.toString());
      return this._SignInService.refreshToken().pipe(
        switchMap((token: any) => {
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        })
      );
    } else {
      localStorage.clear();
      this.router.navigate(['/auth/signin']);
      return throwError(() => 'Token Expired');
    }
  }
}
