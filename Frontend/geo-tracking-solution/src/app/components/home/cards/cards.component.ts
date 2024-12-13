import { Component } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {

  cards = [
    {
      title: 'Chat',
      description: 'Erfassen, berechnen und analysieren Sie Daten sicher in der Edge, der Cloud und in Rechenzentren.',
      image: 'https://via.placeholder.com/250x150'
    },
    {
      title: 'Map',
      description: 'Nutzen Sie die Chancen der Cloud und gestalten Sie Ihre IT umweltfreundlicher, sicherer und effizienter.',
      image: 'https://via.placeholder.com/250x150'
    },
    {
      title: 'Create User/Group',
      description: 'Verbinden Sie logische mit physischen Elementen, um die Sicherheit und Vertraulichkeit Ihrer IT-Services zu gewährleisten.',
      image: 'https://via.placeholder.com/250x150'
    },
    {
      title: 'Settings',
      description: 'Vernetzen Sie Geräte effizient und nutzen Sie innovative IoT-Lösungen für eine smartere Zukunft.',
      image: 'https://via.placeholder.com/250x150'
    }
  ];

}
