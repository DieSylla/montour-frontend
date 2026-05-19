import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-entreprises',
  templateUrl: './admin-entreprises.page.html',
  styleUrls: ['./admin-entreprises.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminEntreprisesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
