import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, notificationsOutline, shieldOutline, helpCircleOutline, chevronForwardOutline, logOutOutline, homeOutline, ticketOutline, calendarOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavComponent, BottomNavProviderComponent],
})
export class ProfilePage implements OnInit {
  user: any = null;
  role = '';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    addIcons({
      personOutline, notificationsOutline, shieldOutline,
      helpCircleOutline, chevronForwardOutline, logOutOutline,
      homeOutline, ticketOutline, calendarOutline
    });
  }

  ngOnInit() {
    this.loadUser();
  }

  ionViewWillEnter() {
    this.loadUser();
  }

  loadUser() {
    this.user = this.authService.getUser();
    this.role = this.user?.role || 'CLIENT';
  }

  getRoleLabel(): string {
    switch(this.role) {
      case 'CLIENT': return 'Client';
      case 'PRESTATAIRE': return 'Prestataire';
      case 'ADMIN': return 'Administrateur';
      default: return 'Client';
    }
  }

  isClient(): boolean {
    return this.role === 'CLIENT';
  }

  isPrestataire(): boolean {
    return this.role === 'PRESTATAIRE';
  }

  goTo(page: string) {
    console.log('Navigate to:', page);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}