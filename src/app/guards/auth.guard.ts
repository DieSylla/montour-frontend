import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const role = auth.getRole();
    if (role === requiredRole || role === 'ADMIN') {
      return true;
    }

    // Rediriger vers le bon dashboard selon le rôle
    if (role === 'PRESTATAIRE') {
      router.navigate(['/provider-dashboard']);
    } else {
      router.navigate(['/client-home']);
    }
    return false;
  };
};
