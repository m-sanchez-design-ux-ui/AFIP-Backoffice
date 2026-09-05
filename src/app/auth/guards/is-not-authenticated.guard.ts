import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { SignInService } from "../services/sign-in.service";

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const signInService = inject( SignInService );
  const router      = inject( Router );

  const url = localStorage.getItem('path');

  if ( signInService.isAuthenticated() ) {
    router.navigateByUrl(`/${url}`)
    return false;
  }

  return true;
};
