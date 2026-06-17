import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, ticketOutline, calendarOutline, personOutline } from 'ionicons/icons';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-active-ticket',
  templateUrl: './active-ticket.page.html',
  styleUrls: ['./active-ticket.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon,
    MontourHeaderComponent, BottomNavComponent, SidebarComponent],
})
export class ActiveTicketPage implements OnInit, OnDestroy {
  ticket: any = null;
  heureEstimee = '';
  nbPersonnes = 0;
  loading = true;
  private polling: Subscription | null = null;

  constructor(
    private ticketService: TicketService,
    private api: ApiService,
    public authService: AuthService,
    public router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ homeOutline, ticketOutline, calendarOutline, personOutline });
  }

  ngOnInit() { this.loadTicket(); }
  ionViewWillEnter() { this.loadTicket(); this.startPolling(); }
  ionViewWillLeave() { this.stopPolling(); }
  ngOnDestroy() { this.stopPolling(); }

  startPolling() {
    this.stopPolling();
    this.polling = interval(10000).subscribe(() => this.rafraichirTicket());
  }

  stopPolling() {
    this.polling?.unsubscribe();
    this.polling = null;
  }

  loadTicket() {
    this.loading = true;
    this.ticketService.getTicketActif().subscribe({
      next: (t: any) => {
        this.ticket = t;
          console.log('Ticket:', t); // Ajouter cette ligne

        this.loading = false;
        if (t) {
          this.calculerHeure(t.tempsAttenteEstime);
          this.chargerNbPersonnes(t.prestataireId);
        }
      },
      error: () => { this.ticket = null; this.loading = false; }
    });
  }

  rafraichirTicket() {
    this.ticketService.getTicketActif().subscribe({
      next: (t: any) => {
        if (t) {
          this.ticket = t;
          this.calculerHeure(t.tempsAttenteEstime);
          this.chargerNbPersonnes(t.prestataireId);
        }
      },
      error: () => {}
    });
  }

  chargerNbPersonnes(prestataireId: string) {
    this.api.get<any>(`tickets/file/${prestataireId}`).subscribe({
      next: (data: any) => {
        this.nbPersonnes = data?.total || 0;
      },
      error: () => { this.nbPersonnes = 0; }
    });
  }

  calculerHeure(minutes: number) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    this.heureEstimee = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  partagerPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log('Position:', pos.coords.latitude, pos.coords.longitude);
      });
    }
  }

  async annuler() {
    const alert = await this.alertCtrl.create({
      header: 'Annuler le ticket ?',
      message: 'Votre place sera donnée au suivant.',
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui, annuler',
          handler: () => {
            this.ticketService.annulerTicket(this.ticket.id).subscribe({
              next: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Ticket annulé',
                  duration: 2000,
                  color: 'success'
                });
                await toast.present();
                this.router.navigate(['/client-home']);
              },
              error: () => {}
            });
          }
        }
      ]
    });
    await alert.present();
  }

  goBack() { this.router.navigate(['/client-home']); }
}