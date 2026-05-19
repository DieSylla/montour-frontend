import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline, locationOutline, chevronForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavComponent],
})
export class BookingPage implements OnInit {
  reservations: any[] = [];
  loading = true;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ calendarOutline, timeOutline, locationOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.loadReservations();
  }

  ionViewWillEnter() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.api.get<any[]>('reservations/mes-reservations').subscribe({
      next: (data) => {
        this.reservations = data || [];
        this.loading = false;
      },
      error: () => {
        this.reservations = [];
        this.loading = false;
      }
    });
  }

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'CONFIRMEE': return '#006c49';
      case 'EN_ATTENTE': return '#D4A017';
      case 'REFUSEE': return '#ba1a1a';
      default: return '#434654';
    }
  }

  getStatutLabel(statut: string): string {
    switch(statut) {
      case 'CONFIRMEE': return 'Confirmé';
      case 'EN_ATTENTE': return 'En attente';
      case 'REFUSEE': return 'Refusé';
      default: return statut;
    }
  }

  voirDetail(reservation: any) {
    this.router.navigate(['/active-ticket'], { state: { reservation } });
  }
}