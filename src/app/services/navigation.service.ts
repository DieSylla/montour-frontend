import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * NavigationService — remplace history.state pour passer des données entre pages.
 * history.state est perdu au rafraîchissement. Ce service garde les données en mémoire
 * et permet une navigation fiable.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _state: Record<string, any> = {};

  constructor(private router: Router) {}

  /** Naviguer vers une page en passant des données */
  navigateTo(path: string, data: Record<string, any> = {}) {
    this._state = { ...data };
    this.router.navigate([path]);
  }

  /** Récupérer une donnée passée à la navigation */
  get<T>(key: string): T | null {
    // Priorité : notre state en mémoire, puis history.state comme fallback
    return (this._state[key] ?? history.state?.[key]) as T ?? null;
  }

  /** Vider le state */
  clear() {
    this._state = {};
  }
}
