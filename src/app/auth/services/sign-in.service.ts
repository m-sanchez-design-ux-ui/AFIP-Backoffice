import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, tap } from 'rxjs';

import { PasswordChangeRequest } from 'app/auth/pages/password-change/models/PasswordChange.model';
import { LoginRequest } from 'app/auth/pages/sign-in/models/login-request.model';
import { ConfigService } from 'app/shared/services/config.service';
import { IForgotPasswordRequest } from 'app/auth/interfaces/forgot-password.interface';
import { IResetPasswordRequest } from 'app/auth/interfaces/reset-password.interface';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  public static readonly TOKEN = 'token';
  public static readonly REFRESHTOKEN = 'refreshToken';
  public static readonly REFRESHCOUNT = 'refreshCount';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {}

  getToken() {
    return localStorage.getItem(SignInService.TOKEN);
  }

  refreshToken() {
    return this.httpClient
      .post<any>(
        `${this.configService.getProperty(
          'apiUrl'
        )}/v1/auth/refresh`,
        { refreshToken: localStorage.getItem('refreshToken') }
      )
      .pipe(
        tap((tokens) => {
          localStorage.setItem(SignInService.REFRESHCOUNT, '0');
          localStorage.setItem(SignInService.REFRESHTOKEN, tokens.refreshToken);
          localStorage.setItem(SignInService.TOKEN, tokens.accessToken);
        })
      );
  }

  login(data: LoginRequest) {
    return this.httpClient.post<any>(
      `${this.configService.getProperty('apiUrl')}/v1/auth/login`,
      data
    );
  }

  forgotPassword(request: IForgotPasswordRequest) {
    return this.httpClient.post(
      `${this.configService.getProperty(
        'apiUrl'
      )}/v1/users/forgot-password`,
      request
    );
  }

  resetPassword(request: IResetPasswordRequest) {
    return this.httpClient.post(
      `${this.configService.getProperty(
        'apiUrl'
      )}/v1/users/reset-password`,
      request
    );
  }

  changePassword(request: PasswordChangeRequest) {
    return this.httpClient.post<any>(
      `${this.configService.getProperty(
        'apiUrl'
      )}/v1/auth/change-password`,
      request
    );
  }

  logout() {
    return this.httpClient.post<any>(
      `${this.configService.getProperty('apiUrl')}/v1/auth/logout`,
      { refreshToken: localStorage.getItem('refreshToken') }
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
