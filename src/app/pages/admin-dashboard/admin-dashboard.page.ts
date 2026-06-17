import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, businessOutline, ticketOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline, personOutline, calendarOutline, statsChartOutline, timeOutline, chevronForwardOutline, mailOutline, callOutline, cardOutline, locationOutline, checkmarkOutline, closeOutline, notificationsOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge, SidebarComponent],
})
export class AdminDashboardPage implements OnInit {
  user: any = null;
  nbNotifNonLues = 0;
  stats: any = {
    utilisateurs: { total: 0, clients: 0, prestataires: 0 },
    entreprises: { total: 0, validees: 0, enAttente: 0 },
    ticketsDuJour: { total: 0, enAttente: 0, traites: 0, annules: 0 },
    rdvDuJour: { total: 0, confirmes: 0, enAttente: 0 },
  };
  pendingEntreprises: any[] = [];
  loading = true;
  activeTab = 'stats';

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router
  ) {
    addIcons({ peopleOutline, businessOutline, ticketOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline, personOutline, calendarOutline, statsChartOutline, timeOutline, chevronForwardOutline, mailOutline, callOutline, cardOutline, locationOutline, checkmarkOutline, closeOutline, notificationsOutline });
  }

  ngOnInit() { this.user = this.authService.getUser(); this.loadStats(); this.loadPendingEntreprises(); this.chargerNotifsNonLues(); }
  ionViewWillEnter() { this.loadStats(); this.loadPendingEntreprises(); this.chargerNotifsNonLues(); }

  chargerNotifsNonLues() {
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => { this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length; },
      error: () => { this.nbNotifNonLues = 0; }
    });
  }

  loadStats() {
    this.api.get<any>('admin/stats').subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadPendingEntreprises() {
    this.api.get<any[]>('entreprises/admin/pending').subscribe({
      next: (data) => { this.pendingEntreprises = data || []; },
      error: () => { this.pendingEntreprises = []; }
    });
  }

  formatDate(ts: any): string {
    if (!ts) return '';
    if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  valider(entreprise: any) {
    this.api.patch(`entreprises/${entreprise.id}/valider`).subscribe({
      next: (res: any) => { entreprise.statut = 'VALIDEE'; entreprise.codeHex = res.codeHex; this.loadPendingEntreprises(); this.loadStats(); },
      error: () => {}
    });
  }

  rejeter(entreprise: any) {
    this.api.patch(`entreprises/${entreprise.id}/rejeter`, { motif: 'Non conforme' }).subscribe({
      next: () => { this.loadPendingEntreprises(); },
      error: () => {}
    });
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}