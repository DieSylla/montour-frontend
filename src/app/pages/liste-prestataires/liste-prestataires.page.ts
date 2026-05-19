import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chevronForwardOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { NavigationService } from '../../services/navigation.service';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-liste-prestataires',
  templateUrl: './liste-prestataires.page.html',
  styleUrls: ['./liste-prestataires.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, MontourHeaderComponent, BottomNavComponent],
})
export class ListePrestatairesPage implements OnInit {
  service: any     = null;
  prestataires: any[] = [];
  loading          = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private nav: NavigationService,
    public router: Router
  ) {
    addIcons({ arrowBackOutline, chevronForwardOutline, personOutline });
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

    // Charger les prestataires de l'entreprise depuis l'API
    this.api.get<any[]>(`entreprises/${this.service.id}/prestataires`).subscribe({
      next: (data) => {
        this.prestataires = data || [];
        this.loading = false;
      },
      error: () => {
        this.prestataires = [];
        this.loading = false;
      }
    });
  }

  choisirPrestataire(prestataire: any) {
    this.nav.navigateTo('/select-creneau', {
      service:     this.service,
      prestataire
    });
  }

  goBack() {
    this.nav.navigateTo('/service-detail', { service: this.service });
  }
}
