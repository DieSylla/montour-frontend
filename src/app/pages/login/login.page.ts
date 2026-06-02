import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonSpinner, ToastController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonSpinner, MontourHeaderComponent],
})
export class LoginPage {
  email    = '';
  password = '';
  loading  = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      await this.showToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    this.loading = true;
    const loader = await this.loadingCtrl.create({ message: 'Connexion...' });
    await loader.present();

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: async (res: any) => {
        this.loading = false;
        await loader.dismiss();

        // Sauvegarder token + user
        this.authService.saveToken(res.access_token, res.user);

        // Redirection selon le rôle
        const role = res.user?.role;
        if (role === 'CLIENT')       this.router.navigate(['/client-home']);
        else if (role === 'PRESTATAIRE') this.router.navigate(['/provider-dashboard']);
        else if (role === 'ADMIN')   this.router.navigate(['/admin-dashboard']);
        else {
          await this.showToast('Rôle inconnu : ' + role, 'danger');
        }
      },
      error: async (err) => {
        this.loading = false;
        await loader.dismiss();

        // Afficher le vrai message d'erreur du backend
        const msg =
          err.error?.message?.message ||
          err.error?.message ||
          err.message ||
          'Erreur de connexion — vérifiez que le serveur est démarré';

        await this.showToast(msg, 'danger');
        console.error('Login error:', err);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
