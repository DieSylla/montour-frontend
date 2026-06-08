import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, LoadingController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { NavigationService } from '../../services/navigation.service';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
  selector: 'app-recap-reservation',
  templateUrl: './recap-reservation.page.html',
  styleUrls: ['./recap-reservation.page.scss'],
  standalone: true,
  imports: [SidebarComponent, CommonModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavComponent],
})
export class RecapReservationPage implements OnInit {
  service: any    = null;
  prestataire: any = null;
  creneau: any    = null;
  user: any       = null;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private nav: NavigationService,
    public router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.service    = this.nav.get<any>('service');
    this.prestataire = this.nav.get<any>('prestataire');
    this.creneau    = this.nav.get<any>('creneau');
    this.user       = this.authService.getUser();

    if (!this.service || !this.creneau) {
      this.router.navigate(['/client-home']);
    }
  }

  async valider() {
    const creneauId    = this.creneau?.id;
    const prestataireId = this.prestataire?.id || this.service?.prestataireId;
    const entrepriseId  = this.service?.entrepriseId;

    if (!creneauId) {
      const toast = await this.toastCtrl.create({
        message: 'Créneau invalide — veuillez recommencer',
        duration: 3000, color: 'danger'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Réservation en cours...' });
    await loading.present();

    this.api.post('reservations', { creneauId, prestataireId, entrepriseId }).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        this.nav.navigateTo('/confirmation-rdv', {
          service:       this.service,
          prestataire:   this.prestataire,
          creneau:       this.creneau,
          statut:        res.statut,
          reservationId: res.reservationId
        });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.message?.message || err.error?.message || 'Erreur lors de la réservation';
        const toast = await this.toastCtrl.create({ message: msg, duration: 3000, color: 'danger' });
        await toast.present();
      }
    });
  }

  goBack() {
    this.nav.navigateTo('/select-creneau', {
      service:     this.service,
      prestataire: this.prestataire
    });
  }
}
