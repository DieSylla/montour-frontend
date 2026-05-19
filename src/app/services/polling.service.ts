import { Injectable, OnDestroy } from '@angular/core';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollingService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private subscription: Subscription | null = null;

  startPolling(callback: () => void, intervalMs: number = 30000) {
    this.stopPolling();
    this.subscription = interval(intervalMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => callback());
  }

  stopPolling() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}