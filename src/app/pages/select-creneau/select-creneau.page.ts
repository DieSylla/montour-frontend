import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chevronForwardOutline, ticketOutline, calendarOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { NavigationService } from '../../services/navigation.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

type Vue = 'choix' | 'calendrier';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
  selector: 'app-select-creneau',
  templateUrl: './select-creneau.page.html',
  styleUrls: ['./select-creneau.page.scss'],
  standalone: true,
  imports: [SidebarComponent, CommonModule, IonContent, IonIcon, IonSpinner, BottomNavComponent],
})
export class SelectCreneauPage implements OnInit {
  service: any     = null;
  prestataire: any = null;
  vue: Vue         = 'choix';

  selectedSlot: any   = null;
  selectedDate        = '';
  moisActuel          = '';
  calendarDays: any[] = [];
  joursLabels         = ['L','M','M','J','V','S','D'];
  currentDate         = new Date();
  creneaux: any[]     = [];
  slotsDisponibles: any[] = [];
  loading             = false;
  loadingTicket       = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private nav: NavigationService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, chevronForwardOutline, ticketOutline, calendarOutline });
  }

  ngOnInit() {
    this.service     = this.nav.get<any>('service');
    this.prestataire = this.nav.get<any>('prestataire');
    if (!this.service || !this.prestataire) {
      this.router.navigate(['/client-home']); return;
    }
    this.generateCalendar();
    this.loadCreneaux();
  }

  ionViewWillEnter() {
    if (!this.prestataire) this.prestataire = this.nav.get<any>('prestataire');
    if (!this.service)     this.service     = this.nav.get<any>('service');
    this.resetCalendar();
    this.loadCreneaux();
  }

  loadCreneaux() {
    const prestataireId = this.prestataire?.id;
    if (!prestataireId) return;
    this.loading = true;
    this.api.get<any[]>(`creneaux/${prestataireId}/disponibles`).subscribe({
      next: (data) => { this.creneaux = data || []; this.loading = false; },
      error: ()    => { this.creneaux = [];         this.loading = false; }
    });
  }

  async prendreTicket() {
    this.loadingTicket = true;
    this.api.post('tickets', {
      prestataireId: this.prestataire.id,
      entrepriseId:  this.service.id,
      specialite:    this.prestataire.specialite
    }).subscribe({
      next: async () => {
        this.loadingTicket = false;
        this.router.navigate(['/mes-rdv']);
      },
      error: async (err) => {
        this.loadingTicket = false;
        const msg = err.error?.message?.message || err.error?.message || 'Erreur création ticket';
        const toast = await this.toastCtrl.create({ message: msg, duration: 3000, color: 'danger', position: 'top' });
        await toast.present();
      }
    });
  }

  ouvrirCalendrier() { this.vue = 'calendrier'; }
  retourChoix()      { this.vue = 'choix'; }

  getSlotsForDate(date: string): any[] {
    return this.creneaux.filter(c => c.date === date);
  }
  hasCreneaux(date: string): boolean {
    return this.creneaux.some(c => c.date === date);
  }

  generateCalendar() {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.moisActuel = this.currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date(); today.setHours(0,0,0,0);
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    this.calendarDays = [];
    for (let i = 0; i < offset; i++) this.calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d); date.setHours(0,0,0,0);
      this.calendarDays.push({ num: d, date: date.toLocaleDateString('fr-FR'), passe: date < today });
    }
  }

  moisPrecedent() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()-1, 1);
    this.resetCalendar();
  }
  moisSuivant() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+1, 1);
    this.resetCalendar();
  }
  resetCalendar() {
    this.selectedDate = ''; this.selectedSlot = null; this.slotsDisponibles = [];
    this.generateCalendar();
  }
  selectDate(day: any) {
    if (day.passe) return;
    this.selectedDate     = day.date;
    this.selectedSlot     = null;
    this.slotsDisponibles = this.getSlotsForDate(day.date);
  }
  selectSlot(slot: any) { this.selectedSlot = slot; }

  continuer() {
    if (!this.selectedSlot) return;
    this.nav.navigateTo('/recap-reservation', {
      service:     this.service,
      prestataire: this.prestataire,
      creneau:     { ...this.selectedSlot, date: this.selectedDate }
    });
  }

  goBack() {
    this.nav.navigateTo('/service-detail', { service: this.service });
  }
}