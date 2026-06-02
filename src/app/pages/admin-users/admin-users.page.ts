import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personOutline, businessOutline, shieldOutline, searchOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner,CommonModule,SidebarComponent],
})
export class AdminUsersPage implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  searchQuery = '';
  filtreRole = 'TOUS';

  constructor(
    private api: ApiService,
    public router: Router,
  ) {
    addIcons({ arrowBackOutline, personOutline, businessOutline, shieldOutline, searchOutline });
  }

  ngOnInit() { this.loadUsers(); }
  ionViewWillEnter() { this.loadUsers(); }

  loadUsers() {
    this.loading = true;
    this.api.get<any[]>('admin/users').subscribe({
      next: (data) => {
        this.users = data || [];
        this.appliquerFiltres();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  appliquerFiltres() {
    let result = [...this.users];

    // Filtre par rôle
    if (this.filtreRole !== 'TOUS') {
      result = result.filter(u => u.role === this.filtreRole);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.nom?.toLowerCase().includes(q) ||
        u.prenom?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }

    this.filteredUsers = result;
  }

  setFiltreRole(role: string) {
    this.filtreRole = role;
    this.appliquerFiltres();
  }

  getRoleIcon(role: string): string {
    const m: any = { CLIENT: 'person-outline', PRESTATAIRE: 'business-outline', ADMIN: 'shield-outline' };
    return m[role] || 'person-outline';
  }

  getRoleColor(role: string): string {
    const m: any = { CLIENT: '#1C6E8C', PRESTATAIRE: '#006c49', ADMIN: '#ba1a1a' };
    return m[role] || '#9fa1b0';
  }

  getRoleLabel(role: string): string {
    const m: any = { CLIENT: 'Client', PRESTATAIRE: 'Prestataire', ADMIN: 'Admin' };
    return m[role] || role;
  }

  getInitiales(user: any): string {
    return ((user.prenom?.charAt(0) || '') + (user.nom?.charAt(0) || '')).toUpperCase();
  }

  formatDate(date: any): string {
    if (!date) return '—';
    const d = date._seconds ? new Date(date._seconds * 1000) : new Date(date);
    return d.toLocaleDateString('fr-FR');
  }
}