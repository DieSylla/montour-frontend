import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, ToastController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';
import { MontourHeaderComponent } from '../../components/montour-header/montour-header.component';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: true,
imports: [CommonModule, FormsModule, IonContent, MontourHeaderComponent],})
export class VerifyOtpPage implements OnInit, OnDestroy {
  otp = '';
  userId = '';
  otpDev = '';
  timer = 120;
  timerDisplay = '02:00';
  timerInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const state = history.state;
    this.userId = state.userId || '';
    this.otpDev = state.otp || '';
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--;
      const min = Math.floor(this.timer / 60);
      const sec = this.timer % 60;
      this.timerDisplay = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
      if (this.timer <= 0) clearInterval(this.timerInterval);
    }, 1000);
  }

  pressKey(key: string) {
    if (this.otp.length < 6) {
      this.otp += key;
    }
  }

  deleteKey() {
    this.otp = this.otp.slice(0, -1);
  }

  async verify() {
    if (this.otp.length < 6) {
      this.showToast('Entrez les 6 chiffres du code OTP');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Vérification...' });
    await loading.present();

    this.authService.verifyOtp(this.userId, this.otp).subscribe({
      next: async () => {
        await loading.dismiss();
        this.showToast('Compte vérifié ! Connectez-vous.');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loading.dismiss();
        this.otp = '';
        this.showToast(err.error?.message?.message || 'Code OTP incorrect');
      }
    });
  }

  goBack() {
    this.router.navigate(['/register']);
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
}