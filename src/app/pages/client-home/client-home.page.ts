import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, notificationsOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { NavigationService } from '../../services/navigation.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.page.html',
  styleUrls: ['./client-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge, BottomNavComponent, SidebarComponent],
})
export class ClientHomePage implements OnInit {
  user: any = null;
  search = '';
  selectedCategory = 'Tous';
  loading = false;
  nbNotifNonLues = 0;
  entreprises: any[] = [];
  entreprisesFiltrees: any[] = [];

  categories = [
    { label: 'Tous',          icon: '🌐' },
    { label: 'Santé',         icon: '🏥' },
    { label: 'Automobile',    icon: '🚗' },
    { label: 'Administratif', icon: '🏛️' },
  ];

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private nav: NavigationService,
    public router: Router
  ) {
    addIcons({ searchOutline, notificationsOutline });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadEntreprises();
    this.loadNotifications();
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.loadEntreprises();
    this.loadNotifications();
  }

  loadNotifications() {
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => { this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length; },
      error: () => { this.nbNotifNonLues = 0; }
    });
  }

  loadEntreprises() {
    this.loading = true;
    this.api.get<any[]>('entreprises').subscribe({
      next: (data) => {
        this.entreprises = (data || []).map(e => ({
          ...e,
          icon: this.getIcon(e.categorie)
        }));
        this.filtrer();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getIcon(categorie: string): string {
    const map: any = {
      'Santé': '🏥', 'Automobile': '🚗',
      'Administratif': '🏛️', 'Lavage auto': '🫧'
    };
    return map[categorie] || '🏢';
  }

  filtrer() {
    this.entreprisesFiltrees = this.entreprises.filter(e => {
      const matchCat    = this.selectedCategory === 'Tous' || e.categorie === this.selectedCategory;
      const matchSearch = !this.search || e.nom.toLowerCase().includes(this.search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  selectCategory(cat: any) { this.selectedCategory = cat.label; this.filtrer(); }
  onSearch()               { this.filtrer(); }

  allerVersService(entreprise: any) {
    this.nav.navigateTo('/service-detail', { service: entreprise });
  }
}