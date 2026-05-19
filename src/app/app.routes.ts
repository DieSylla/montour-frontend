import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ── Entrée ──────────────────────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── Pages publiques (pas de guard) ──────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/verify-otp/verify-otp.page').then(m => m.VerifyOtpPage),
  },

  // ── Pages CLIENT ────────────────────────────────────────────────────
  {
    path: 'client-home',
    canActivate: [roleGuard('CLIENT')],
    loadComponent: () => import('./pages/client-home/client-home.page').then(m => m.ClientHomePage),
  },
  {
    path: 'recherche-service',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/recherche-service/recherche-service.page').then(m => m.RechercheServicePage),
  },
  {
    path: 'liste-prestataires',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/liste-prestataires/liste-prestataires.page').then(m => m.ListePrestatairesPage),
  },
  {
    path: 'service-detail',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/service-detail/service-detail.page').then(m => m.ServiceDetailPage),
  },
  {
    path: 'select-creneau',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/select-creneau/select-creneau.page').then(m => m.SelectCreneauPage),
  },
  {
    path: 'recap-reservation',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/recap-reservation/recap-reservation.page').then(m => m.RecapReservationPage),
  },
  {
    path: 'confirmation-rdv',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/confirmation-rdv/confirmation-rdv.page').then(m => m.ConfirmationRdvPage),
  },
  {
    path: 'active-ticket',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/active-ticket/active-ticket.page').then(m => m.ActiveTicketPage),
  },
  {
    path: 'mes-rdv',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mes-rdv/mes-rdv.page').then(m => m.MesRdvPage),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },

  // ── Pages PRESTATAIRE ───────────────────────────────────────────────
  {
    path: 'provider-dashboard',
    canActivate: [roleGuard('PRESTATAIRE')],
    loadComponent: () => import('./pages/provider-dashboard/provider-dashboard.page').then(m => m.ProviderDashboardPage),
  },
  {
    path: 'provider-file',
    canActivate: [roleGuard('PRESTATAIRE')],
    loadComponent: () => import('./pages/provider-file/provider-file.page').then(m => m.ProviderFilePage),
  },
  {
    path: 'provider-rdv',
    canActivate: [roleGuard('PRESTATAIRE')],
    loadComponent: () => import('./pages/provider-rdv/provider-rdv.page').then(m => m.ProviderRdvPage),
  },
  {
    path: 'gestion-creneaux',
    canActivate: [roleGuard('PRESTATAIRE')],
    loadComponent: () => import('./pages/gestion-creneaux/gestion-creneaux.page').then(m => m.GestionCreneauxPage),
  },

  // ── Pages ADMIN ─────────────────────────────────────────────────────
  {
    path: 'admin-dashboard',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
  },
  {
    path: 'admin-entreprises',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/admin-entreprises/admin-entreprises.page').then(m => m.AdminEntreprisesPage),
  },
  {
    path: 'admin-users',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/admin-users/admin-users.page').then(m => m.AdminUsersPage),
  },

  // ── Fallback ─────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'login' },
];
