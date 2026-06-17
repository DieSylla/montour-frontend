import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FcmService } from './services/fcm.service';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private fcmService: FcmService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Demander permission et enregistrer token si connecté
    if (this.authService.getUser()) {
      this.fcmService.requestPermissionAndGetToken();
      this.fcmService.listenForeground();
    }
  }
}