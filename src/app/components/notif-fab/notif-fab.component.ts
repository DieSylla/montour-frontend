import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonFab, IonFabButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-notif-fab',
  templateUrl: './notif-fab.component.html',
  styleUrls: ['./notif-fab.component.scss'],
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonIcon, IonBadge],
})
export class NotifFabComponent implements OnInit, OnDestroy {
  nbNotifNonLues = 0;
  private polling: Subscription | null = null;

  constructor(
    public router: Router,
    private api: ApiService
  ) {
    addIcons({ notificationsOutline });
  }

  ngOnInit() {
    this.chargerNotifs();
    this.polling = interval(15000).subscribe(() => this.chargerNotifs());
  }

  ngOnDestroy() {
    this.polling?.unsubscribe();
  }

  chargerNotifs() {
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => {
        this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length;
      },
      error: () => { this.nbNotifNonLues = 0; }
    });
  }
}