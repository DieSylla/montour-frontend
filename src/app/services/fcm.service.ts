import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { ApiService } from './api';

const firebaseConfig = {
  apiKey: "AIzaSyDPcOav0UaY0FbmYmZE3VqPEM-boUwhYiI",
  authDomain: "montour-cabcb.firebaseapp.com",
  projectId: "montour-cabcb",
  storageBucket: "montour-cabcb.firebasestorage.app",
  messagingSenderId: "336785741612",
  appId: "1:336785741612:web:412b663f0c30a5ab6afe89"
};

const VAPID_KEY = "BHDzRaJoHHSXZCuHoobURkusgo-jBXDKb9m0hIpNZuXlimfOT9gCbXkUdx5ob8Qz7phtlR7gBYamUwrjT3RGe2I";

@Injectable({ providedIn: 'root' })
export class FcmService {

  private messaging = getMessaging(
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  );

  constructor(private api: ApiService) {}

  async requestPermissionAndGetToken(): Promise<void> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permission notifications refusée');
        return;
      }
      const token = await getToken(this.messaging, { vapidKey: VAPID_KEY });
      if (token) {
await this.api.patch('auth/fcm-token', { token }).toPromise();
        console.log('FCM Token enregistré');
      }
    } catch (err) {
      console.error('Erreur FCM:', err);
    }
  }

  listenForeground(): void {
    onMessage(this.messaging, (payload: MessagePayload) => {
      const title = payload.notification?.title || 'MonTour';
      const body = payload.notification?.body || '';
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/assets/icon/favicon.png' });
      }
    });
  }
}