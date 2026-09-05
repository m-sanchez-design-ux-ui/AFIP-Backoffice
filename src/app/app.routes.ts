import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from 'app/auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from 'app/auth/guards/is-not-authenticated.guard';

export const routes: Routes = [
  // auth
  {
    path: 'auth',
    loadComponent: () =>
      import('./_layout/anonymous/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    canActivate: [isNotAuthenticatedGuard],
    children: [
      {
        path: 'signin',
        title: 'Sign in',
        loadComponent: () =>
          import('./auth/pages/sign-in/sign-in.component').then(
            (c) => c.SignInComponent
          ),
      },
      {
        path: 'password-recover',
        title: 'Password recover',
        loadComponent: () =>
          import(
            './auth/pages/password-recover/password-recover.component'
          ).then((c) => c.PasswordRecoverComponent),
      },
      {
        path: 'password-change',
        loadComponent: () =>
          import('./auth/pages/password-change/password-change.component').then(
            (c) => c.PasswordChangeComponent
          ),
      },
    ],
  },
  // Other routes
  {
    path: '404',
    loadComponent: () =>
      import('./error-pages/pages/error-404/error-404.component').then(
        (c) => c.Error404Component
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./error-pages/pages/error-500/error-500.component').then(
        (c) => c.Error500Component
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard-list',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./_layout/authorized/authorized.component').then(
        (c) => c.AuthorizedComponent
      ),
    canActivate: [isAuthenticatedGuard],
    canActivateChild: [isAuthenticatedGuard],
    children: [
      {
        path: 'dashboard-list',
        loadComponent: () =>
          import(
            './dashboard/pages/dashboard-list/dashboard-list.component'
          ).then((c) => c.DashboardListComponent),
      },
      {
        path: 'file-list/:id',
        loadComponent: () =>
          import('./file-details/pages/file-list/file-list.component').then(
            (c) => c.FileListComponent
          ),
      },
      {
        path: 'consolidated-files',
        loadComponent: () =>
          import(
            './consolidated-files/pages/consolidated-files/consolidated-files.component'
          ).then((c) => c.ConsolidatedFilesComponent),
      },
    ],
  },
];
