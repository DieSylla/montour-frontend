import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonFab, IonFabButton, IonBadge, ToastController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, notificationsOutline, shieldOutline,
  helpCircleOutline, chevronForwardOutline, logOutOutline,
  createOutline, checkmarkOutline, closeOutline, lockClosedOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { BottomNavProviderComponent } from '../../components/bottom-nav-provider/bottom-nav-provider.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonIcon, IonSpinner,
    IonFab, IonFabButton, IonBadge,
    BottomNavComponent, BottomNavProviderComponent, SidebarComponent
  ],
})
export class ProfilePage implements OnInit {
  user: any = null;
  role = '';
  loading = false;
  nbNotifNonLues = 0;

  editMode = false;
  form = { nom: '', prenom: '', telephone: '', specialite: '', confirmationMode: '' };

  pwdMode = false;
  pwd = { ancien: '', nouveau: '', confirm: '' };
  loadingPwd = false;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      personOutline, notificationsOutline, shieldOutline,
      helpCircleOutline, chevronForwardOutline, logOutOutline,
      createOutline, checkmarkOutline, closeOutline, lockClosedOutline
    });
  }

  ngOnInit()         { this.loadUser(); this.chargerNotifsNonLues(); }
  ionViewWillEnter() { this.loadUser(); this.chargerNotifsNonLues(); }

  chargerNotifsNonLues() {
    this.api.get<any[]>('notifications').subscribe({
      next: (data) => {
        this.nbNotifNonLues = (data || []).filter((n: any) => !n.lu).length;
      },
      error: () => { this.nbNotifNonLues = 0; }
    });
  }

  loadUser() {
    this.user = this.authService.getUser();
    this.role = this.user?.role || 'CLIENT';
    this.form = {
      nom:              this.user?.nom || '',
      prenom:           this.user?.prenom || '',
      telephone:        this.user?.telephone || '',
      specialite:       this.user?.specialite || '',
      confirmationMode: this.user?.confirmationMode || 'auto',
    };
  }

  getRoleLabel(): string {
    const m: any = { CLIENT: 'Client', PRESTATAIRE: 'Prestataire', ADMIN: 'Administrateur' };
    return m[this.role] || 'Client';
  }

  getRoleForSidebar(): string {
    if (this.isAdmin()) return 'ADMIN';
    if (this.isPrestataire()) return 'PRESTATAIRE';
    return 'CLIENT';
  }

  isClient():      boolean { return this.role === 'CLIENT'; }
  isPrestataire(): boolean { return this.role === 'PRESTATAIRE'; }
  isAdmin():       boolean { return this.role === 'ADMIN'; }

  getInitiales(): string {
    return ((this.user?.prenom?.charAt(0) || '') + (this.user?.nom?.charAt(0) || '')).toUpperCase();
  }

  ouvrirEdit() { this.editMode = true; this.pwdMode = false; }
  annulerEdit() { this.editMode = false; this.loadUser(); }

  async sauvegarder() {
    if (!this.form.nom || !this.form.prenom) {
      return this.toast('Nom et prénom obligatoires', 'danger');
    }
    this.loading = true;
    this.api.patch('auth/profile', this.form).subscribe({
      next: async (updated: any) => {
        this.loading = false;
        this.editMode = false;
        this.authService.updateUser(updated);
        this.loadUser();
        this.toast('Profil mis à jour ✅', 'success');
      },
      error: async () => {
        this.loading = false;
        this.toast('Erreur lors de la mise à jour', 'danger');
      }
    });
  }

  ouvrirPwd() { this.pwdMode = true; this.editMode = false; this.pwd = { ancien: '', nouveau: '', confirm: '' }; }
  annulerPwd() { this.pwdMode = false; }

  async changerMotDePasse() {
    if (!this.pwd.ancien || !this.pwd.nouveau || !this.pwd.confirm) {
      return this.toast('Remplissez tous les champs', 'danger');
    }
    if (this.pwd.nouveau !== this.pwd.confirm) {
      return this.toast('Les mots de passe ne correspondent pas', 'danger');
    }
    if (this.pwd.nouveau.length < 6) {
      return this.toast('Minimum 6 caractères', 'danger');
    }
    this.loadingPwd = true;
    this.api.patch('auth/password', {
      ancienMotDePasse: this.pwd.ancien,
      nouveauMotDePasse: this.pwd.nouveau,
    }).subscribe({
      next: async () => {
        this.loadingPwd = false;
        this.pwdMode = false;
        this.toast('Mot de passe modifié ✅', 'success');
      },
      error: async (err) => {
        this.loadingPwd = false;
        const msg = err.error?.message || 'Ancien mot de passe incorrect';
        this.toast(msg, 'danger');
      }
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'Déconnecter', role: 'destructive', handler: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }}
      ]
    });
    await alert.present();
  }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    await t.present();
  }
}