import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, ToastController, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';
import { personOutline, storefrontOutline, eyeOutline, eyeOffOutline, ticketOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
imports: [CommonModule, FormsModule, IonContent, IonIcon, MontourHeaderComponent],})
export class RegisterPage {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  password = '';
  role = 'CLIENT';
  codeEntreprise = '';
  specialite = '';
  acceptedCGU = false;
  showPassword = false;
  cguVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
addIcons({ personOutline, storefrontOutline, eyeOutline, eyeOffOutline, ticketOutline });
  }

  async register() {
    if (!this.nom || !this.prenom || !this.email || !this.password || !this.telephone) {
      this.showToast('Veuillez remplir tous les champs');
      return;
    }
    if (!this.acceptedCGU) {
      this.showToast('Veuillez accepter les CGU');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Inscription...' });
    await loading.present();

    const data: any = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      password: this.password,
      role: this.role,
      acceptedCGU: this.acceptedCGU,
    };

    if (this.role === 'PRESTATAIRE') {
      data.codeEntreprise = this.codeEntreprise;
      data.specialite = this.specialite;
    }

    this.authService.register(data).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        this.router.navigate(['/verify-otp'], {
          state: { userId: res.userId, otp: res.otp }
        });
      },
      error: async (err) => {
        await loading.dismiss();
        this.showToast(err.error?.message?.message?.[0] || 'Erreur lors de l\'inscription');
      }
    });
  }

  showCGU() {
    this.cguVisible = true;
  }

  closeCGU() {
    this.cguVisible = false;
  }

  acceptCGUFromModal() {
    this.acceptedCGU = true;
    this.cguVisible = false;
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  changeRole(newRole: string) {
  this.role = newRole;
  this.acceptedCGU = false;
  this.codeEntreprise = '';
  this.specialite = '';
}
}