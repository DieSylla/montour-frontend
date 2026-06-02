import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, ToastController, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, arrowBackOutline, checkmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-gestion-creneaux',
  templateUrl: './gestion-creneaux.page.html',
  styleUrls: ['./gestion-creneaux.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavProviderComponent,CommonModule,SidebarComponent],
})
export class GestionCreneauxPage implements OnInit {
  user: any = null;
  creneaux: any[] = [];
  showAddForm = false;
  loading = false;

  nouveauCreneau = {
    heureDebut: '',
    heureFin: '',
    dureePrestation: 30,
    dates: [] as string[]
  };

  durees = [15, 20, 30, 45, 60];

  joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarDays: any[] = [];
  moisActuel = '';
  currentDate = new Date();

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ addOutline, trashOutline, arrowBackOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.generateCalendar();
    this.loadCreneaux();
  }

  ionViewWillEnter() {
    this.loadCreneaux();
  }

  loadCreneaux() {
    this.loading = true;
    this.api.get<any[]>('creneaux/prestataire').subscribe({
      next: (data) => {
        // Grouper les créneaux par heureDebut/heureFin
        const grouped: { [key: string]: any } = {};
        (data || []).forEach(c => {
          const key = `${c.heureDebut}-${c.heureFin}-${c.dureePrestation}`;
          if (!grouped[key]) {
            grouped[key] = {
              id: c.id,
              heureDebut: c.heureDebut,
              heureFin: c.heureFin,
              dureePrestation: c.dureePrestation,
              dates: [],
              ids: []
            };
          }
          grouped[key].dates.push(c.date);
          grouped[key].ids.push(c.id);
        });
        this.creneaux = Object.values(grouped);
        this.loading = false;
      },
      error: () => {
        this.creneaux = [];
        this.loading = false;
      }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.moisActuel = this.currentDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    this.calendarDays = [];
    for (let i = 0; i < startOffset; i++) this.calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      this.calendarDays.push({
        num: d,
        date: date.toLocaleDateString('fr-FR'),
        passe: date < today
      });
    }
  }

  moisPrecedent() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  moisSuivant() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  toggleDate(day: any) {
    const index = this.nouveauCreneau.dates.indexOf(day.date);
    if (index > -1) {
      this.nouveauCreneau.dates.splice(index, 1);
    } else {
      this.nouveauCreneau.dates.push(day.date);
    }
  }

  isDateSelected(date: string): boolean {
    return this.nouveauCreneau.dates.includes(date);
  }

  calculerCapacite(): number {
    if (!this.nouveauCreneau.heureDebut || !this.nouveauCreneau.heureFin) return 0;
    const [hDebut, mDebut] = this.nouveauCreneau.heureDebut.split(':').map(Number);
    const [hFin, mFin] = this.nouveauCreneau.heureFin.split(':').map(Number);
    const totalMinutes = (hFin * 60 + mFin) - (hDebut * 60 + mDebut);
    if (totalMinutes <= 0) return 0;
    return Math.floor(totalMinutes / this.nouveauCreneau.dureePrestation);
  }

  async ajouterCreneau() {
    if (!this.nouveauCreneau.heureDebut || !this.nouveauCreneau.heureFin) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez définir les heures de début et de fin',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (this.nouveauCreneau.heureDebut >= this.nouveauCreneau.heureFin) {
      const toast = await this.toastCtrl.create({
        message: 'L\'heure de fin doit être après l\'heure de début',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (this.nouveauCreneau.dates.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez sélectionner au moins une date',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const capacite = this.calculerCapacite();
    if (capacite === 0) {
      const toast = await this.toastCtrl.create({
        message: 'La durée de prestation est trop longue pour ce créneau',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Création en cours...' });
    await loading.present();

    this.api.post('creneaux', {
      heureDebut: this.nouveauCreneau.heureDebut,
      heureFin: this.nouveauCreneau.heureFin,
      dureePrestation: this.nouveauCreneau.dureePrestation,
      dates: this.nouveauCreneau.dates
    }).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        this.resetForm();
        this.showAddForm = false;
        this.loadCreneaux();
        const toast = await this.toastCtrl.create({
          message: `${capacite} client(s) par session — Créneau ajouté !`,
          duration: 2500,
          color: 'success'
        });
        await toast.present();
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Erreur lors de la création du créneau',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async supprimerCreneau(creneau: any) {
    const loading = await this.loadingCtrl.create({ message: 'Suppression...' });
    await loading.present();

    // Supprimer tous les créneaux du groupe
    const deletePromises = creneau.ids.map((id: string) =>
      this.api.delete(`creneaux/${id}`).toPromise()
    );

    Promise.all(deletePromises).then(async () => {
      await loading.dismiss();
      this.loadCreneaux();
      const toast = await this.toastCtrl.create({
        message: 'Créneau supprimé',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }).catch(async () => {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la suppression',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    });
  }

  resetForm() {
    this.nouveauCreneau = {
      heureDebut: '',
      heureFin: '',
      dureePrestation: 30,
      dates: []
    };
  }

  goBack() {
    this.router.navigate(['/provider-dashboard']);
  }
}