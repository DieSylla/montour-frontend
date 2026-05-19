import { Injectable } from '@angular/core';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private api: ApiService) {}

  creerTicket(data: { prestataireId: string; entrepriseId: string; specialite: string }) {
    return this.api.post('tickets', data);
  }

  getTicketActif() {
    return this.api.get('tickets/actif');
  }

  annulerTicket(ticketId: string) {
    return this.api.patch(`tickets/${ticketId}/annuler`, {});
  }
}