import { Component } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  frontendCards = [
    {
      title: 'Alice Doe',
      subtitle: 'frontenddev',
      image: 'https://bulma.io/assets/images/placeholders/1280x960.png',
      avatar: 'https://bulma.io/assets/images/placeholders/96x96.png',
      tag: '#frontend',
      date: '2024-11-17'
    },
    {
      title: 'Bob Smith',
      subtitle: 'uiux',
      image: 'https://bulma.io/assets/images/placeholders/1280x960.png',
      avatar: 'https://bulma.io/assets/images/placeholders/96x96.png',
      tag: '#design',
      date: '2024-11-17'
    }
  ];

  backendCards = [
    {
      title: 'Charlie Brown',
      subtitle: 'backenddev',
      image: '../../../../assets/images/ebertz.png',
      avatar: 'https://bulma.io/assets/images/placeholders/96x96.png',
      tag: '#backend',
      date: '2024-11-17'
    },
    {
      title: 'Daisy White',
      subtitle: 'databaseadmin',
      image: 'https://bulma.io/assets/images/placeholders/1280x960.png',
      avatar: 'https://bulma.io/assets/images/placeholders/96x96.png',
      tag: '#databases',
      date: '2024-11-17'
    }
  ];

  betreuerCards = [
    {
      title: 'Edward Green',
      subtitle: 'manager',
      image: 'https://bulma.io/assets/images/placeholders/1280x960.png',
      avatar: 'https://bulma.io/assets/images/placeholders/96x96.png',
      tag: '#supervisor',
      date: '2024-11-17'
    }
  ];
}
