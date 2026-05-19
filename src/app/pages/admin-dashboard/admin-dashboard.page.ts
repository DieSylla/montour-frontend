import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, businessOutline, ticketOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, MontourHeaderComponent],
})
export class AdminDashboardPage implements OnInit {
  user: any = null;
  stats = { totalUsers: 0, totalEntreprises: 0, totalTickets: 0 };
  pendingEntreprises: any[] = [];
  loading = true;
  activeTab = 'stats';

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router
  ) {
    addIcons({ peopleOutline, businessOutline, ticketOutline, checkmarkCircleOutline, closeCircleOutline, logOutOutline, personOutline });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadStats();
    this.loadPendingEntreprises();
  }

  ionViewWillEnter() {
    this.loadStats();
    this.loadPendingEntreprises();
  }

  loadStats() {
    this.api.get<any>('admin/stats').subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadPendingEntreprises() {
    this.api.get<any[]>('entreprises/pending').subscribe({
      next: (data) => { this.pendingEntreprises = data || []; },
      error: () => { this.pendingEntreprises = []; }
    });
  }

  valider(entreprise: any) {
    this.api.patch(`entreprises/${entreprise.id}/valider`).subscribe({
      next: (res: any) => {
        entreprise.statut = 'VALIDEE';
        entreprise.codeHex = res.codeHex;
        this.loadPendingEntreprises();
        this.loadStats();
      },
      error: () => {}
    });
  }

  rejeter(entreprise: any) {
    this.api.patch(`entreprises/${entreprise.id}/rejeter`, { motif: 'Non conforme' }).subscribe({
      next: () => { this.loadPendingEntreprises(); },
      error: () => {}
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}