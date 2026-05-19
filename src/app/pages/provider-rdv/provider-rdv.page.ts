import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonIcon, IonSpinner,
  ToastController, LoadingController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, trashOutline, arrowBackOutline, checkmarkOutline,
  checkmarkCircleOutline, closeCircleOutline, personRemoveOutline,
  calendarOutline, timeOutline, chevronForwardOutline, chevronDownOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';

type Vue = 'liste' | 'form' | 'clients-creneau';

@Component({
  selector: 'app-provider-rdv',
  templateUrl: './provider-rdv.page.html',
  styleUrls: ['./provider-rdv.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner,
    BottomNavProviderComponent],
})
export class ProviderRdvPage implements OnInit {
  user: any = null;
  vue: Vue = 'liste';
  loading = false;

  // Créneaux groupés par date
  creneauxBruts: any[] = [];
  creneauxParDate: { date: string; creneaux: any[]; expanded: boolean }[] = [];

  // Vue clients d'un créneau
  creneauSelectionne: any = null;
  clientsDuCreneau: any[] = [];
  loadingClients = false;

  // Formulaire
  nouveauCreneau = {
    heureDebut: '', heureFin: '',
    dureePrestation: 30, dates: [] as string[]
  };
  durees = [15, 20, 30, 45, 60];
  joursLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  calendarDays: any[] = [];
  moisActuel = '';
  currentDate = new Date();

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      addOutline, trashOutline, arrowBackOutline, checkmarkOutline,
      checkmarkCircleOutline, closeCircleOutline, personRemoveOutline,
      calendarOutline, timeOutline, chevronForwardOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.generateCalendar();
    this.loadCreneaux();
  }

  ionViewWillEnter() { this.loadCreneaux(); }

  // ── CHARGEMENT ET GROUPEMENT ─────────────────────────────────────
  loadCreneaux() {
    this.loading = true;
    this.api.get<any[]>('creneaux/prestataire').subscribe({
      next: (data) => {
        this.creneauxBruts = data || [];
        this.grouperParDate();
        this.loading = false;
      },
      error: () => { this.creneauxBruts = []; this.creneauxParDate = []; this.loading = false; }
    });
  }

  grouperParDate() {
    const map: { [date: string]: any[] } = {};
    for (const c of this.creneauxBruts) {
      if (!map[c.date]) map[c.date] = [];
      map[c.date].push(c);
    }
    // Trier les créneaux de chaque date par heure
    this.creneauxParDate = Object.keys(map)
      .sort((a, b) => {
        const [jA, mA, aA] = a.split('/').map(Number);
        const [jB, mB, aB] = b.split('/').map(Number);
        return new Date(aA, mA-1, jA).getTime() - new Date(aB, mB-1, jB).getTime();
      })
      .map(date => ({
        date,
        creneaux: map[date].sort((a: any, b: any) => a.heureDebut.localeCompare(b.heureDebut)),
        expanded: false
      }));
  }

  toggleGroupe(groupe: any) { groupe.expanded = !groupe.expanded; }

  // ── VOIR CLIENTS D'UN CRÉNEAU ─────────────────────────────────────
  voirClients(creneau: any) {
    this.creneauSelectionne = creneau;
    this.vue = 'clients-creneau';
    this.loadingClients = true;
    this.api.get<any[]>(`reservations/creneau/${creneau.id}`).subscribe({
      next: (data) => { this.clientsDuCreneau = data || []; this.loadingClients = false; },
      error: () => { this.clientsDuCreneau = []; this.loadingClients = false; }
    });
  }

  // ── SUPPRESSION CRÉNEAU ───────────────────────────────────────────
  async supprimerCreneau(creneau: any) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer ce créneau ?',
      message: `${creneau.heureDebut} — ${creneau.heureFin} du ${creneau.date}\n\nLes clients ayant réservé seront notifiés.`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'Supprimer', role: 'destructive', handler: () => this.executerSuppression(creneau) }
      ]
    });
    await alert.present();
  }

  async executerSuppression(creneau: any) {
    const loader = await this.loadingCtrl.create({ message: 'Suppression...' });
    await loader.present();
    this.api.delete(`creneaux/${creneau.id}`).subscribe({
      next: async () => {
        await loader.dismiss();
        if (this.vue === 'clients-creneau') this.vue = 'liste';
        this.loadCreneaux();
        this.toast('Créneau supprimé', 'warning');
      },
      error: async () => { await loader.dismiss(); this.toast('Erreur', 'danger'); }
    });
  }

  // ── ACTIONS RDV ───────────────────────────────────────────────────
  async valider(rdv: any) {
    const loader = await this.loadingCtrl.create({ message: '...' });
    await loader.present();
    this.api.patch(`reservations/${rdv.id}/valider`, {}).subscribe({
      next: async () => {
        await loader.dismiss();
        rdv.statut = 'CONFIRMEE';
        this.toast('RDV confirmé ✅', 'success');
      },
      error: async () => { await loader.dismiss(); this.toast('Erreur', 'danger'); }
    });
  }

  async refuser(rdv: any) {
    const loader = await this.loadingCtrl.create({ message: '...' });
    await loader.present();
    this.api.patch(`reservations/${rdv.id}/refuser`, {}).subscribe({
      next: async () => {
        await loader.dismiss();
        rdv.statut = 'REFUSEE';
        this.toast('RDV refusé', 'warning');
      },
      error: async () => { await loader.dismiss(); this.toast('Erreur', 'danger'); }
    });
  }

  async marquerAbsent(rdv: any) {
    const loader = await this.loadingCtrl.create({ message: '...' });
    await loader.present();
    this.api.patch(`reservations/${rdv.id}/absent`, {}).subscribe({
      next: async () => {
        await loader.dismiss();
        rdv.statut = 'MANQUE';
        this.toast('Client marqué absent', 'warning');
      },
      error: async () => { await loader.dismiss(); this.toast('Erreur', 'danger'); }
    });
  }

  // ── FORMULAIRE ────────────────────────────────────────────────────
  ouvrirFormulaire() { this.vue = 'form'; this.resetForm(); }
  retourListe()      { this.vue = 'liste'; this.loadCreneaux(); }

  async ajouterCreneau() {
    if (!this.nouveauCreneau.heureDebut || !this.nouveauCreneau.heureFin)
      return this.toast('Définissez les heures', 'danger');
    if (this.nouveauCreneau.heureDebut >= this.nouveauCreneau.heureFin)
      return this.toast('Heure de fin doit être après le début', 'danger');
    if (this.nouveauCreneau.dates.length === 0)
      return this.toast('Sélectionnez au moins une date', 'danger');

    const loader = await this.loadingCtrl.create({ message: 'Création...' });
    await loader.present();
    this.api.post('creneaux', {
      heureDebut: this.nouveauCreneau.heureDebut,
      heureFin: this.nouveauCreneau.heureFin,
      dureePrestation: this.nouveauCreneau.dureePrestation,
      dates: this.nouveauCreneau.dates
    }).subscribe({
      next: async () => {
        await loader.dismiss();
        this.vue = 'liste';
        this.loadCreneaux();
        this.toast(`Créneau ajouté pour ${this.nouveauCreneau.dates.length} date(s) !`, 'success');
        this.resetForm();
      },
      error: async () => { await loader.dismiss(); this.toast('Erreur création', 'danger'); }
    });
  }

  // ── CALENDRIER ────────────────────────────────────────────────────
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.moisActuel = this.currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    this.calendarDays = [];
    for (let i = 0; i < offset; i++) this.calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d); date.setHours(0,0,0,0);
      this.calendarDays.push({ num: d, date: date.toLocaleDateString('fr-FR'), passe: date < today });
    }
  }

  moisPrecedent() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()-1,1); this.generateCalendar(); }
  moisSuivant()   { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+1,1); this.generateCalendar(); }
  toggleDate(day: any) {
    const idx = this.nouveauCreneau.dates.indexOf(day.date);
    if (idx > -1) this.nouveauCreneau.dates.splice(idx, 1);
    else this.nouveauCreneau.dates.push(day.date);
  }
  isDateSelected(date: string) { return this.nouveauCreneau.dates.includes(date); }
  calculerCapacite(): number {
    if (!this.nouveauCreneau.heureDebut || !this.nouveauCreneau.heureFin) return 0;
    const [hD, mD] = this.nouveauCreneau.heureDebut.split(':').map(Number);
    const [hF, mF] = this.nouveauCreneau.heureFin.split(':').map(Number);
    const total = (hF*60+mF) - (hD*60+mD);
    return total <= 0 ? 0 : Math.floor(total / this.nouveauCreneau.dureePrestation);
  }
  resetForm() {
    this.nouveauCreneau = { heureDebut:'', heureFin:'', dureePrestation:30, dates:[] };
    this.currentDate = new Date(); this.generateCalendar();
  }

  // ── HELPERS ───────────────────────────────────────────────────────
  getStatutColor(s: string) {
    const m: any = { CONFIRMEE:'#006c49', EN_ATTENTE:'#D4A017', REFUSEE:'#ba1a1a', ANNULEE:'#ba1a1a', MANQUE:'#C1614F' };
    return m[s] || '#9fa1b0';
  }
  getStatutLabel(s: string) {
    const m: any = { CONFIRMEE:'Confirmé', EN_ATTENTE:'En attente', REFUSEE:'Refusé', ANNULEE:'Annulé', MANQUE:'Absent' };
    return m[s] || s;
  }
  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    await t.present();
  }
}
