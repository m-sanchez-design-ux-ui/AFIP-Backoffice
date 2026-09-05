import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SignInService } from '../services/sign-in.service';

export const isAuthenticatedGuard: CanActivateFn = (_, state) => {
  const signInService = inject(SignInService);
  const router = inject(Router);

  const url = state.url;
  localStorage.setItem('path', url);

  if (signInService.isAuthenticated()) return true;

  router.navigateByUrl('/auth/signin');
  return false;
};
