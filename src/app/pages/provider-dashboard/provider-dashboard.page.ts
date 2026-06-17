import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { megaphoneOutline, checkmarkDoneOutline, calendarOutline, ticketOutline, timeOutline, notificationsOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';
import { Subscription, interval } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';



interface ElementFile {
  id: string;
  type: 'TICKET' | 'RDV';
  rang: number;
  heureAffichage: string;
  clientId: string;
  statut: string;
  label: string;
  priorite: number;
  data: any;
}

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.page.html',
  styleUrls: ['./provider-dashboard.page.scss'],
  standalone: true,
imports: [CommonModule, IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge, BottomNavProviderComponent, SidebarComponent],
})
export class ProviderDashboardPage implements OnInit, OnDestroy {
  user: any = null;
  entrepriseNom = '';
  fileUnifiee: ElementFile[] = [];
  stats = { enAttente: 0, rdvDuJour: 0, traites: 0 };
  nbNotifNonLues = 0;
  loading = false;
  private polling: Subscription | null = null;
  private tickets: any[] = [];
  private rdvs: any[] = [];

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ megaphoneOutline, checkmarkDoneOutline, calendarOutline, ticketOutline, timeOutline, notificationsOutline });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.entrepriseNom = this.user?.entrepriseNom || '';
    this.loadData();
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.entrepriseNom = this.user?.entrepriseNom || '';
    this.loadData();
    this.startPolling();
  }
  ionViewWillLeave() { this.stopPolling(); }
  ngOnDestroy()      { this.stopPolling(); }

  startPolling() {
    this.stopPolling();
    this.polling = interval(10000).subscribe(() => this.loadData());
  }
  stopPolling() { this.polling?.unsubscribe(); this.polling = null; }

  loadData() {
  this.loading = true;
  const today = new Date().toLocaleDateString('fr-FR');

  // Charger tickets
  this.api.get<any[]>('tickets/prestataire').subscribe({
    next: (data) => {
      const tous = data || [];

      // Clients en attente = tickets EN_ATTENTE du jour
      const ticketsEnAttente = tous.filter(t => {
        const d = t.createdAt?._seconds
          ? new Date(t.createdAt._seconds * 1000).toLocaleDateString('fr-FR')
          : null;
        return t.statut === 'EN_ATTENTE' && d === today;
      });

      // Traités = TERMINE + ABSENT du jour
      this.stats.traites = tous.filter(t => {
        const d = t.createdAt?._seconds
          ? new Date(t.createdAt._seconds * 1000).toLocaleDateString('fr-FR')
          : null;
        return (t.statut === 'TERMINE' || t.statut === 'ABSENT') && d === today;
      }).length;

      this.tickets = tous.filter(t => {
        const d = t.createdAt?._seconds
          ? new Date(t.createdAt._seconds * 1000).toLocaleDateString('fr-FR')
          : null;
        return (t.statut === 'EN_ATTENTE' || t.statut === 'APPELE') && d === today;
      });

      // Stats en attente = tickets EN_ATTENTE + RDV CONFIRMÉS (calculé après chargement RDV)
      this.stats.enAttente = ticketsEnAttente.length;

      this.construireFileUnifiee();
      this.loading = false;
    },
    error: () => { this.tickets = []; this.construireFileUnifiee(); this.loading = false; }
  });

  // Charger RDV
  this.api.get<any[]>('reservations/prestataire').subscribe({
    next: (data) => {
      const tous = data || [];
      const todayFR = new Date().toLocaleDateString('fr-FR');
      const todayISO = new Date().toISOString().split('T')[0];

      this.rdvs = tous.filter(r => {
        const dateRdv = r.date || '';
        return (dateRdv === todayFR || dateRdv === todayISO)
          && (r.statut === 'CONFIRMEE' || r.statut === 'EN_ATTENTE');
      });

      // RDV confirmés du jour s'ajoutent aux clients en attente
      const rdvConfirmes = this.rdvs.filter(r => r.statut === 'CONFIRMEE').length;
      this.stats.enAttente += rdvConfirmes;

      // RDV à confirmer (mode manuel)
      this.stats.rdvDuJour = this.rdvs.filter(r => r.statut === 'EN_ATTENTE').length;

      this.construireFileUnifiee();
    },
    error: () => { this.rdvs = []; this.construireFileUnifiee(); }
  });

  // Notifications
  this.api.get<any[]>('notifications').subscribe({
    next: (data) => {
      this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length;
    },
    error: () => { this.nbNotifNonLues = 0; }
  });
}

  construireFileUnifiee() {
    const now = new Date();
    const heureActuelleMin = now.getHours() * 60 + now.getMinutes();
    const DUREE_MOY = 15;
    const file: ElementFile[] = [];

    // RDV confirmés en premier
    const rdvConfirmes = this.rdvs
      .filter(r => r.statut === 'CONFIRMEE')
      .sort((a, b) => (a.heureDebut || '').localeCompare(b.heureDebut || ''));

    rdvConfirmes.forEach((rdv) => {
      const [h, m] = (rdv.heureDebut || '00:00').split(':').map(Number);
      file.push({
        id: rdv.id, type: 'RDV', rang: 0,
        heureAffichage: rdv.heureDebut || '--:--',
        clientId: rdv.clientId, statut: rdv.statut,
        label: `RDV ${rdv.heureDebut}`,
        priorite: h * 60 + m, data: rdv,
      });
    });

    // Tickets walk-in
    const heuresRdv = rdvConfirmes.map(r => {
      const [h, m] = (r.heureDebut || '00:00').split(':').map(Number);
      return h * 60 + m;
    });

    const ticketsActifs = this.tickets
      .filter(t => t.statut === 'EN_ATTENTE' || t.statut === 'APPELE')
      .sort((a, b) => a.rang - b.rang);

    let curseurMin = heureActuelleMin;
    ticketsActifs.forEach((ticket, idx) => {
      while (heuresRdv.some(h => Math.abs(h - curseurMin) < DUREE_MOY)) {
        curseurMin += DUREE_MOY;
      }
      const h = Math.floor(curseurMin / 60);
      const m = curseurMin % 60;
      file.push({
        id: ticket.id, type: 'TICKET', rang: idx + 1,
        heureAffichage: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
        clientId: ticket.clientId, statut: ticket.statut,
        label: `Ticket #${ticket.numero}`,
        priorite: curseurMin, data: ticket,
      });
      curseurMin += DUREE_MOY;
    });

    // RDV en attente de confirmation
    this.rdvs.filter(r => r.statut === 'EN_ATTENTE').forEach(rdv => {
      const [h, m] = (rdv.heureDebut || '00:00').split(':').map(Number);
      file.push({
        id: rdv.id, type: 'RDV', rang: 0,
        heureAffichage: rdv.heureDebut || '--:--',
        clientId: rdv.clientId, statut: rdv.statut,
        label: `RDV ${rdv.heureDebut} (en attente)`,
        priorite: h * 60 + m + 1000, data: rdv,
      });
    });

    this.fileUnifiee = file.sort((a, b) => a.priorite - b.priorite);
  }

  async appelerSuivant() {
    const premier = this.fileUnifiee.find(e => e.type === 'TICKET' && e.statut === 'EN_ATTENTE');
    if (!premier) return;
    this.api.patch(`tickets/${premier.id}/appeler`, {}).subscribe({
      next: async () => {
        this.loadData();
        const t = await this.toastCtrl.create({ message: '📣 Client appelé !', duration: 2000, color: 'success' });
        await t.present();
      },
      error: async () => {
        const t = await this.toastCtrl.create({ message: 'Erreur', duration: 2000, color: 'danger' });
        await t.present();
      }
    });
  }

  async terminer(element: ElementFile) {
    if (element.type !== 'TICKET') return;
    this.api.patch(`tickets/${element.id}/terminer`, {}).subscribe({
      next: async () => {
        this.loadData();
        const t = await this.toastCtrl.create({ message: '✅ Service terminé', duration: 2000, color: 'success' });
        await t.present();
      },
      error: () => {}
    });
  }

  getStatutColor(e: ElementFile): string {
    if (e.statut === 'APPELE')    return '#006c49';
    if (e.statut === 'CONFIRMEE') return '#006c49';
    if (e.statut === 'EN_ATTENTE') return '#D4A017';
    return '#9fa1b0';
  }

  getTypeColor(e: ElementFile): string {
    return e.type === 'RDV' ? '#006c49' : '#1C6E8C';
  }
}