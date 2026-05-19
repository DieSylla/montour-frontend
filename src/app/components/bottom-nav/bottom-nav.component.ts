import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, ticketOutline, calendarOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class BottomNavComponent {
  @Input() activePage = 'home';

  constructor(public router: Router) {
addIcons({ homeOutline, calendarOutline, personOutline });  }

  getRole(): string {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user)?.role || 'CLIENT' : 'CLIENT';
  }

  getHomeRoute(): string {
    return this.getRole() === 'PRESTATAIRE' ? '/provider-dashboard' : '/client-home';
  }

  isClient(): boolean {
    return this.getRole() === 'CLIENT';
  }
}