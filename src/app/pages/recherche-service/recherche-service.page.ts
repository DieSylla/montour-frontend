import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
  selector: 'app-recherche-service',
  templateUrl: './recherche-service.page.html',
  styleUrls: ['./recherche-service.page.scss'],
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, IonContent, IonIcon, MontourHeaderComponent, BottomNavComponent],
})
export class RechercheServicePage implements OnInit {
  search = '';
  selectedCategory = 'Tous';

  categories = [
    { label: 'Tous' },
    { label: 'Cliniques' },
    { label: 'Garages' },
    { label: 'Administratif' },
    { label: 'Lavage auto' },
  ];

  services = [
    { icon: '🏥', nom: 'Clinique Pasteur', type: 'Santé & Bien-être', prestataireId: 'mgIPEYYJ5ETV0tm60ccn', entrepriseId: 'Iytu9Ibw0g0wZmOT6JUP', specialite: 'Cardiologie', confirmationMode: 'auto' },
    { icon: '🚗', nom: 'Garage Auto Dakar', type: 'Automobile', prestataireId: 'mgIPEYYJ5ETV0tm60ccn', entrepriseId: 'Iytu9Ibw0g0wZmOT6JUP', specialite: 'Vidange', confirmationMode: 'manual' },
    { icon: '🏛️', nom: 'Mairie de Dakar', type: 'Administratif', prestataireId: 'mgIPEYYJ5ETV0tm60ccn', entrepriseId: 'Iytu9Ibw0g0wZmOT6JUP', specialite: 'État civil', confirmationMode: 'auto' },
  ];

  get filteredServices() {
    return this.services.filter(s => {
      const matchSearch = s.nom.toLowerCase().includes(this.search.toLowerCase()) ||
                         s.type.toLowerCase().includes(this.search.toLowerCase());
      const matchCategory = this.selectedCategory === 'Tous' ||
                           s.type.toLowerCase().includes(this.selectedCategory.toLowerCase());
      return matchSearch && matchCategory;
    });
  }

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    addIcons({ searchOutline });
  }

  ngOnInit() {}

  selectCategory(cat: any) {
    this.selectedCategory = cat.label;
  }

  choisirService(service: any) {
    this.router.navigate(['/select-creneau'], { state: { service } });
  }
}