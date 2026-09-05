import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeEsAr from '@angular/common/locales/es-AR';

import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha-2';
import { FeatherModule } from 'angular-feather';

import { ConfigService } from 'app/shared/services/config.service';
import { icons } from 'app/shared/icons/icons';
import { InterceptorService } from 'app/shared/services/interceptor.service';
import { MockApiInterceptor } from 'app/shared/services/mock-api.interceptor';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { LocaleService } from 'app/locale.service';
import { MenuDataService } from 'app/_layout/authorized/data.menu';
import { NotificationsAlertService } from 'app/shared/services/notifications-alert.service';
import { NotificationsService } from 'app/shared/services/notifications/notifications.service';
import { routes } from 'app/app.routes';

export function init(config: ConfigService) {
  registerLocaleData(localeEsAr, 'es-AR');
  return () => config.load();
}

export function recaptchaSettingsFactory(
  configService: ConfigService
): RecaptchaSettings {
  return {
    siteKey: configService.getProperty('gRecaptchaSiteKey'),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID,
      //useValue: 'es-AR',
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale(),
    },
    MenuDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useFactory: recaptchaSettingsFactory,
      deps: [ConfigService],
    },
    ConfigService,
    NotificationsService,
    NotificationsAlertService,
    LoadingService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    // DEMO ONLY: intercepts API calls with local mock data since this
    // portfolio demo has no access to the real backend. Runs after
    // InterceptorService so the auth header is still attached, but before
    // any request actually reaches the network.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockApiInterceptor,
      multi: true,
    },
    importProvidersFrom(FeatherModule.pick(icons)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
