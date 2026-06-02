import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, notificationsOutline, checkmarkDoneOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline, ticketOutline, megaphoneOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner,CommonModule,SidebarComponent],
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    public location: Location
  ) {
    addIcons({ arrowBackOutline, notificationsOutline, checkmarkDoneOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline, ticketOutline, megaphoneOutline });
  }

  ngOnInit() { this.loadNotifications(); }
  ionViewWillEnter() { this.loadNotifications(); }

  loadNotifications() {
    this.loading = true;
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => { this.notifications = data || []; this.loading = false; },
      error: () => { this.notifications = []; this.loading = false; }
    });
  }

  marquerLu(notif: any) {
    if (notif.lu) return;
    this.api.patch(`notifications/${notif.id}/lire`, {}).subscribe({
      next: () => { notif.lu = true; },
      error: () => {}
    });
  }

  marquerToutLu() {
    this.notifications.filter(n => !n.lu).forEach(n => this.marquerLu(n));
  }

  get nonLues(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  getIcon(type: string): string {
    const map: any = {
      NOUVELLE_RESERVATION: 'calendar-outline',
      RESERVATION_CREEE:    'checkmark-circle-outline',
      RESERVATION_ANNULEE:  'close-circle-outline',
      TICKET_CREE:          'ticket-outline',
      TICKET_APPELE:        'megaphone-outline',
      SERVICE_TERMINE:      'checkmark-done-outline',
    };
    return map[type] || 'notifications-outline';
  }

  getIconColor(type: string): string {
    const map: any = {
      NOUVELLE_RESERVATION: '#1C6E8C',
      RESERVATION_CREEE:    '#006c49',
      RESERVATION_ANNULEE:  '#ba1a1a',
      TICKET_CREE:          '#1C6E8C',
      TICKET_APPELE:        '#D4A017',
      SERVICE_TERMINE:      '#006c49',
    };
    return map[type] || '#9fa1b0';
  }

  getIconBg(type: string): string {
    return this.getIconColor(type) + '18';
  }

  formatDate(createdAt: any): string {
    if (!createdAt) return '';
    const date = createdAt._seconds
      ? new Date(createdAt._seconds * 1000)
      : new Date(createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60)    return 'À l\'instant';
    if (diff < 3600)  return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  goBack() { this.location.back(); }
}