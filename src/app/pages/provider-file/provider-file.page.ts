import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { megaphoneOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
  selector: 'app-provider-file',
  templateUrl: './provider-file.page.html',
  styleUrls: ['./provider-file.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavProviderComponent,CommonModule, SidebarComponent],
})
export class ProviderFilePage implements OnInit {
  fileAttente: any[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ megaphoneOutline });
  }

  ngOnInit() {
    this.loadFile();
  }

  ionViewWillEnter() {
    this.loadFile();
  }

  loadFile() {
    this.loading = true;
    this.api.get<any[]>('tickets/prestataire').subscribe({
      next: (data) => {
        this.fileAttente = data || [];
        this.loading = false;
      },
      error: () => {
        this.fileAttente = [];
        this.loading = false;
      }
    });
  }

  async appelerSuivant() {
    if (this.fileAttente.length === 0) return;
    const premier = this.fileAttente[0];
    this.api.patch(`tickets/${premier.id}/appeler`, {}).subscribe({
      next: async () => {
        this.fileAttente.shift();
        this.fileAttente = this.fileAttente.map((t, i) => ({
          ...t,
          rang: i + 1,
          tempsAttenteEstime: (i + 1) * 10
        }));
        const toast = await this.toastCtrl.create({
          message: 'Client suivant appelé !',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: async () => {
        this.fileAttente.shift();
        this.fileAttente = this.fileAttente.map((t, i) => ({
          ...t,
          rang: i + 1,
          tempsAttenteEstime: (i + 1) * 10
        }));
        const toast = await this.toastCtrl.create({
          message: 'Client suivant appelé !',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      }
    });
  }
}