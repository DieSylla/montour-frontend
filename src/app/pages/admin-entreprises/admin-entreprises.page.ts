import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline, businessOutline, mailOutline, callOutline,
  cardOutline, locationOutline, checkmarkOutline, closeOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-entreprises',
  templateUrl: './admin-entreprises.page.html',
  styleUrls: ['./admin-entreprises.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonSpinner, CommonModule, FormsModule, SidebarComponent]
})
export class AdminEntreprisesPage implements OnInit {

  entreprises: any[] = [];
  filteredEntreprises: any[] = [];
  searchQuery = '';
  filtreStatut = 'TOUS';
  loading = false;

  constructor(
    public router: Router,
    private api: ApiService,
    private toastCtrl: ToastController
  ) {
    addIcons({
      searchOutline, businessOutline, mailOutline, callOutline,
      cardOutline, locationOutline, checkmarkOutline, closeOutline,
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.chargerEntreprises();
  }

  ionViewWillEnter() {
    this.chargerEntreprises();
  }

  chargerEntreprises() {
    this.loading = true;
    this.api.get<any[]>('entreprises').subscribe({
      next: (data) => {
        this.entreprises = data || [];
        this.appliquerFiltres();
        this.loading = false;
      },
      error: () => {
        this.entreprises = [];
        this.filteredEntreprises = [];
        this.loading = false;
      }
    });
  }

  setFiltreStatut(statut: string) {
    this.filtreStatut = statut;
    this.appliquerFiltres();
  }

  appliquerFiltres() {
    let result = [...this.entreprises];

    if (this.filtreStatut !== 'TOUS') {
      result = result.filter(e => e.statut === this.filtreStatut);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(e =>
        e.nom?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.typeService?.toLowerCase().includes(q) ||
        e.categorie?.toLowerCase().includes(q)
      );
    }

    this.filteredEntreprises = result;
  }

  async valider(e: any) {
    this.api.patch(`entreprises/${e.id}/valider`, {}).subscribe({
      next: async () => {
        this.chargerEntreprises();
        const t = await this.toastCtrl.create({
          message: `✅ ${e.nom} validée !`, duration: 2000, color: 'success'
        });
        await t.present();
      },
      error: async () => {
        const t = await this.toastCtrl.create({
          message: 'Erreur lors de la validation', duration: 2000, color: 'danger'
        });
        await t.present();
      }
    });
  }

  async rejeter(e: any) {
    this.api.patch(`entreprises/${e.id}/rejeter`, {}).subscribe({
      next: async () => {
        this.chargerEntreprises();
        const t = await this.toastCtrl.create({
          message: `❌ ${e.nom} rejetée`, duration: 2000, color: 'warning'
        });
        await t.present();
      },
      error: async () => {
        const t = await this.toastCtrl.create({
          message: 'Erreur lors du rejet', duration: 2000, color: 'danger'
        });
        await t.present();
      }
    });
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'VALIDEE':    return '#006c49';
      case 'EN_ATTENTE': return '#D4A017';
      case 'REJETEE':    return '#ba1a1a';
      default:           return '#9fa1b0';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'VALIDEE':    return 'Validée';
      case 'EN_ATTENTE': return 'En attente';
      case 'REJETEE':    return 'Rejetée';
      default:           return statut;
    }
  }
}