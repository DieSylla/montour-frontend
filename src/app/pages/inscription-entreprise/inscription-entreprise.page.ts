import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, addOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-inscription-entreprise',
  templateUrl: './inscription-entreprise.page.html',
  styleUrls: ['./inscription-entreprise.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner],
})
export class InscriptionEntreprisePage {
  loading = false;
  currentStep = 1;

  form = {
    nom: '',
    nomResponsable: '',
    typeService: '',
    specialites: [] as string[],
    ninea: '',
    adresse: '',
    latitude: 0,
    longitude: 0,
    email: '',
    telephone: '',
  };

  nouvelleSpecialite = '';

  typesService = [
    'Médical', 'Automobile', 'Administratif',
    'Bancaire', 'Éducation', 'Commerce', 'Autre'
  ];

  constructor(
    private api: ApiService,
    public router: Router,
    private toastCtrl: ToastController,
  ) {
    addIcons({ arrowBackOutline, addOutline, closeOutline, checkmarkOutline });
  }

  ajouterSpecialite() {
    const s = this.nouvelleSpecialite.trim();
    if (!s) return;
    if (this.form.specialites.includes(s)) return;
    this.form.specialites.push(s);
    this.nouvelleSpecialite = '';
  }

  supprimerSpecialite(i: number) {
    this.form.specialites.splice(i, 1);
  }

  async soumettre() {
    // Ajouter automatiquement la spécialité en cours si non vide
    if (this.nouvelleSpecialite.trim()) {
      this.ajouterSpecialite();
    }

    if (!this.form.nom || !this.form.nomResponsable || !this.form.typeService) {
      return this.toast('Remplissez tous les champs obligatoires', 'danger');
    }
    if (!this.form.email || !this.form.telephone) {
      return this.toast('Email et téléphone obligatoires', 'danger');
    }
    if (!this.form.ninea) {
      return this.toast('Le NINEA est obligatoire', 'danger');
    }
    if (this.form.specialites.length === 0) {
      return this.toast('Ajoutez au moins une spécialité', 'danger');
    }

    this.loading = true;
    this.api.post('entreprises/adhesion', this.form).subscribe({
      next: async () => {
        this.loading = false;
        await this.toast('Demande envoyée ! L\'administrateur examinera votre dossier.', 'success');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Erreur lors de la soumission';
        this.toast(msg, 'danger');
      }
    });
  }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color, position: 'top' });
    await t.present();
  }
}