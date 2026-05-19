import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-montour-header',
  templateUrl: './montour-header.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class MontourHeaderComponent {
  @Input() subtitle: string = '';
}