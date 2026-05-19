import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, ToastController, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, ticketOutline, chevronForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { NavigationService } from '../../services/navigation.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, BottomNavComponent],
})
export class ServiceDetailPage implements OnInit {
  service: any = null;
  prestataires: any[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private nav: NavigationService,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBackOutline, calendarOutline, ticketOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.service = this.nav.get<any>('service');
    if (!this.service) { this.router.navigate(['/client-home']); return; }
    this.loadPrestataires();
  }

  ionViewWillEnter() {
    if (!this.service) this.service = this.nav.get<any>('service');
    this.loadPrestataires();
  }

  loadPrestataires() {
    if (!this.service?.id) return;
    this.loading = true;
    this.api.get<any[]>(`entreprises/${this.service.id}/prestataires`).subscribe({
      next: (data) => { this.prestataires = data || []; this.loading = false; },
      error: () => { this.prestataires = []; this.loading = false; }
    });
  }

  choisirPrestataire(prestataire: any) {
    this.nav.navigateTo('/select-creneau', {
      service: this.service,
      prestataire
    });
  }

  goBack() { this.router.navigate(['/client-home']); }
}