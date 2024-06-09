import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const authenticationGuard: CanActivateFn = (_route, _state) => {
  const router: Router = inject(Router)
  const token: string | null = localStorage.getItem(environment.AUTH_TOKEN)
  if (token) {
    return true
  } else {
    router.navigate(['/auth/login']);
    return false
  }
};


export const isLoggedInGuard: CanActivateFn = (_route, _state) => {
  const router: Router = inject(Router)
  const token: string | null = localStorage.getItem(environment.AUTH_TOKEN)
  if (token) {
    router.navigate(['/Task Management']);
  }

  return true;
};
