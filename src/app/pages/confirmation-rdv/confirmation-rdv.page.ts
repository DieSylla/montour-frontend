import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';
import { NavigationService } from '../../services/navigation.service';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-confirmation-rdv',
  templateUrl: './confirmation-rdv.page.html',
  styleUrls: ['./confirmation-rdv.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, MontourHeaderComponent, BottomNavComponent,SidebarComponent],
})
export class ConfirmationRdvPage implements OnInit {
  service: any    = null;
  prestataire: any = null;
  creneau: any    = null;
  statut          = '';
  reservationId   = '';

  constructor(
    public authService: AuthService,
    private nav: NavigationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.service      = this.nav.get<any>('service');
    this.prestataire  = this.nav.get<any>('prestataire');
    this.creneau      = this.nav.get<any>('creneau');
    this.statut       = this.nav.get<string>('statut') || 'CONFIRMEE';
    this.reservationId = this.nav.get<string>('reservationId') || '';

    // Vider le state pour éviter des re-lectures au retour
    this.nav.clear();
  }

  isConfirme(): boolean {
    return this.statut === 'CONFIRMEE';
  }

  voirMesRdv() {
    this.router.navigate(['/mes-rdv']);
  }

  retourAccueil() {
    this.router.navigate(['/client-home']);
  }
}
