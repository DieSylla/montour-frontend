import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, ToastController, AlertController, IonFab, IonFabButton, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ticketOutline, calendarOutline, closeCircleOutline, refreshOutline, timeOutline, personOutline, businessOutline, notificationsOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { Subscription, interval } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-mes-rdv',
  templateUrl: './mes-rdv.page.html',
  styleUrls: ['./mes-rdv.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, BottomNavComponent, SidebarComponent, IonFab, IonFabButton, IonBadge],
})
export class MesRdvPage implements OnInit, OnDestroy {
  user: any = null;
  ticketActif: any = null;
  reservations: any[] = [];
  loading = false;
  heureEstimee = '';
  nbPersonnes = 0;
  nbNotifNonLues = 0;
  private polling: Subscription | null = null;
  private prestatairesCache: Record<string, any> = {};
  private entreprisesCache: Record<string, any> = {};

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ ticketOutline, calendarOutline, closeCircleOutline, refreshOutline, timeOutline, personOutline, businessOutline, notificationsOutline });
  }

  ngOnInit()         { this.user = this.authService.getUser(); this.loadAll(); }
  ionViewWillEnter() { this.loadAll(); this.startPolling(); }
  ionViewWillLeave() { this.stopPolling(); }
  ngOnDestroy()      { this.stopPolling(); }

  startPolling() {
    this.stopPolling();
    this.polling = interval(10000).subscribe(() => { this.loadTicket(); this.chargerNotifsNonLues(); });
  }
  stopPolling() { this.polling?.unsubscribe(); this.polling = null; }

  loadAll() {
    this.loading = true;
    this.loadTicket();
    this.loadReservations();
    this.chargerNotifsNonLues();
  }

  loadTicket() {
    this.api.get<any>('tickets/actif').subscribe({
      next: (t: any) => {
        this.ticketActif = t;
        this.loading = false;
        if (t) {
          this.calculerHeure(t.tempsAttenteEstime);
          this.chargerNbPersonnes(t.prestataireId);
        }
      },
      error: () => { this.ticketActif = null; this.loading = false; }
    });
  }

  chargerNotifsNonLues() {
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => {
        this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length;
      },
      error: () => { this.nbNotifNonLues = 0; }
    });
  }

  calculerHeure(minutes: number) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    this.heureEstimee = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  chargerNbPersonnes(prestataireId: string) {
    this.api.get<any>(`tickets/file/${prestataireId}`).subscribe({
      next: (data: any) => { this.nbPersonnes = data?.total || 0; },
      error: () => { this.nbPersonnes = 0; }
    });
  }

  loadReservations() {
    this.api.get<any[]>('reservations/mes-reservations').subscribe({
      next: (data) => {
        this.api.get<any[]>('entreprises').subscribe({
          next: (entreprises) => {
            this.reservations = (data || []).map(rdv => ({
              ...rdv,
              etablissementNom: entreprises.find(e => e.id === rdv.entrepriseId)?.nom || 'Établissement',
              prestataireNom: rdv.prestataireNom || rdv.specialite || 'Prestataire',
            })).sort((a, b) => {
              if (a.date !== b.date) return a.date.localeCompare(b.date);
              return (a.heureDebut || '').localeCompare(b.heureDebut || '');
            });
          },
          error: () => { this.reservations = data || []; }
        });
      },
      error: () => { this.reservations = []; }
    });
  }

  async getPrestataireNom(prestataireId: string): Promise<string> {
    if (!prestataireId) return 'Prestataire';
    if (this.prestatairesCache[prestataireId]) return this.prestatairesCache[prestataireId];
    return new Promise(resolve => {
      this.api.get<any>(`users/${prestataireId}`).subscribe({
        next: (u: any) => {
          const nom = u ? `${u.prenom} ${u.nom}` : 'Prestataire';
          this.prestatairesCache[prestataireId] = nom;
          resolve(nom);
        },
        error: () => resolve('Prestataire')
      });
    });
  }

  async getEntrepriseNom(entrepriseId: string): Promise<string> {
    if (!entrepriseId) return 'Établissement';
    if (this.entreprisesCache[entrepriseId]) return this.entreprisesCache[entrepriseId];
    const entreprises: any[] = await new Promise(resolve => {
      this.api.get<any[]>('entreprises').subscribe({
        next: (data) => resolve(data || []),
        error: () => resolve([])
      });
    });
    const found = entreprises.find(e => e.id === entrepriseId);
    const nom = found?.nom || 'Établissement';
    this.entreprisesCache[entrepriseId] = nom;
    return nom;
  }

  estAujourdhui(date: string): boolean {
    return date === new Date().toLocaleDateString('fr-FR');
  }

  async annulerTicket() {
    if (!this.ticketActif) return;
    const alert = await this.alertCtrl.create({
      header: 'Annuler le ticket ?',
      message: 'Vous allez quitter la file d\'attente.',
      buttons: [
        { text: 'Non', role: 'cancel' },
        { text: 'Oui, annuler', role: 'destructive', handler: () => {
          this.api.patch(`tickets/${this.ticketActif.id}/annuler`, {}).subscribe({
            next: async () => {
              this.ticketActif = null;
              this.heureEstimee = '';
              this.nbPersonnes = 0;
              const t = await this.toastCtrl.create({ message: 'Ticket annulé', duration: 2000, color: 'success' });
              await t.present();
            },
            error: () => {}
          });
        }}
      ]
    });
    await alert.present();
  }

  async annulerRdv(rdv: any) {
    const alert = await this.alertCtrl.create({
      header: 'Annuler le RDV ?',
      message: `${rdv.etablissementNom} — ${rdv.date} à ${rdv.heureDebut}`,
      buttons: [
        { text: 'Non', role: 'cancel' },
        { text: 'Oui, annuler', role: 'destructive', handler: () => {
          this.api.patch(`reservations/${rdv.id}/annuler`, {}).subscribe({
            next: async () => {
              rdv.statut = 'ANNULEE';
              const t = await this.toastCtrl.create({ message: 'RDV annulé', duration: 2000, color: 'success' });
              await t.present();
            },
            error: () => {}
          });
        }}
      ]
    });
    await alert.present();
  }

  getStatutColor(s: string): string {
    const m: any = { CONFIRMEE:'#006c49', EN_ATTENTE:'#D4A017', REFUSEE:'#ba1a1a', ANNULEE:'#9fa1b0' };
    return m[s] || '#9fa1b0';
  }
  getStatutLabel(s: string): string {
    const m: any = { CONFIRMEE:'Confirmé', EN_ATTENTE:'En attente', REFUSEE:'Refusé', ANNULEE:'Annulé' };
    return m[s] || s;
  }
  getTicketStatutColor(s: string): string {
    return s === 'APPELE' ? '#006c49' : '#1C6E8C';
  }
  peutAnnuler(rdv: any): boolean {
    return rdv.statut === 'EN_ATTENTE' || rdv.statut === 'CONFIRMEE';
  }
}