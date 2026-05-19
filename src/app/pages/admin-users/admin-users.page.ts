import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminUsersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
