import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, ticketOutline, calendarOutline, personOutline } from 'ionicons/icons';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-active-ticket',
  templateUrl: './active-ticket.page.html',
  styleUrls: ['./active-ticket.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavComponent],
})
export class ActiveTicketPage implements OnInit {
  ticket: any = null;
  heureEstimee = '';
  loading = true;

  constructor(
    private ticketService: TicketService,
    public authService: AuthService,
    public router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ homeOutline, ticketOutline, calendarOutline, personOutline });
  }

  ngOnInit() {
    this.loadTicket();
  }

  ionViewWillEnter() {
    this.loadTicket();
  }

  loadTicket() {
    this.loading = true;
    this.ticketService.getTicketActif().subscribe({
      next: (t: any) => {
        this.ticket = t;
        this.loading = false;
        if (t) this.calculerHeure(t.tempsAttenteEstime);
      },
      error: () => {
        this.ticket = null;
        this.loading = false;
      }
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

  goBack() {
    this.router.navigate(['/client-home']);
  }
}