import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, calendarOutline, personOutline,
  ticketOutline, notificationsOutline, peopleOutline,
  businessOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        <span class="material-symbols-outlined">confirmation_number</span>
        <span>MonTour</span>
      </div>
      <nav class="sidebar-nav">

        <ng-container *ngIf="role === 'CLIENT'">
          <div class="nav-item" [class.active]="activePage === 'home'"
            (click)="router.navigate(['/client-home'])">
            <ion-icon name="home-outline"></ion-icon>
            <span>Accueil</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'rdv'"
            (click)="router.navigate(['/mes-rdv'])">
            <ion-icon name="ticket-outline"></ion-icon>
            <span>Mes RDV</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'profil'"
            (click)="router.navigate(['/profile'])">
            <ion-icon name="person-outline"></ion-icon>
            <span>Profil</span>
          </div>
        </ng-container>

        <ng-container *ngIf="role === 'PRESTATAIRE'">
          <div class="nav-item" [class.active]="activePage === 'home'"
            (click)="router.navigate(['/provider-dashboard'])">
            <ion-icon name="home-outline"></ion-icon>
            <span>Tableau de bord</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'rdv'"
            (click)="router.navigate(['/provider-rdv'])">
            <ion-icon name="calendar-outline"></ion-icon>
            <span>Mes créneaux</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'notifications'"
            (click)="router.navigate(['/notifications'])">
            <ion-icon name="notifications-outline"></ion-icon>
            <span>Notifications</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'profil'"
            (click)="router.navigate(['/profile'])">
            <ion-icon name="person-outline"></ion-icon>
            <span>Profil</span>
          </div>
        </ng-container>

        <ng-container *ngIf="role === 'ADMIN'">
          <div class="nav-item" [class.active]="activePage === 'dashboard'"
            (click)="router.navigate(['/admin-dashboard'])">
            <ion-icon name="home-outline"></ion-icon>
            <span>Tableau de bord</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'users'"
            (click)="router.navigate(['/admin-users'])">
            <ion-icon name="people-outline"></ion-icon>
            <span>Utilisateurs</span>
          </div>
          <div class="nav-item" [class.active]="activePage === 'entreprises'"
            (click)="router.navigate(['/admin-entreprises'])">
            <ion-icon name="business-outline"></ion-icon>
            <span>Entreprises</span>
          </div>
        </ng-container>

      </nav>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap');

    .sidebar {
      width: 220px;
      background: white;
      border-right: 1px solid #eef0f4;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      display: none;
      flex-direction: column;
      z-index: 200;
    }

    @media (min-width: 1024px) {
      .sidebar { display: flex; }
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px;
      border-bottom: 1px solid #eef0f4;
      font-size: 20px;
      font-weight: 800;
      color: #1C6E8C;
    }

    .sidebar-logo .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 28px;
      color: #1C6E8C;
    }

    .sidebar-nav {
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #9fa1b0;
      transition: all 0.2s;
    }

    .nav-item ion-icon { font-size: 20px; }

    .nav-item:hover {
      background: #f4f6f9;
      color: #191c1e;
    }

    .nav-item.active {
      background: #1C6E8C;
      color: white;
    }
  `]
})
export class SidebarComponent {
  @Input() role = 'CLIENT';
  @Input() activePage = '';

  constructor(public router: Router) {
    addIcons({
      homeOutline, calendarOutline, personOutline,
      ticketOutline, notificationsOutline, peopleOutline,
      businessOutline
    });
  }
}