import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, notificationsOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav-provider',
  templateUrl: './bottom-nav-provider.component.html',
  styleUrls: ['./bottom-nav-provider.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class BottomNavProviderComponent {
  @Input() activePage = 'home';

  constructor(public router: Router) {
    addIcons({ homeOutline, calendarOutline, notificationsOutline, personOutline });
  }
}