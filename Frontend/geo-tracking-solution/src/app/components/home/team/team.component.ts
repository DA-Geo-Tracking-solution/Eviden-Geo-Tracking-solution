import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  @Input() currentTheme!: string;

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  frontendCards = [
    {
      title: 'Benjamin Suljević',
      subtitle: 'pls follow on GitHub <3',
      image: '../../../../assets/images/Dashboard/Team/suljevic.jpg',
      tag: '#bulma #design #ts #git',
      date: '2024-11-17',
      link: 'https://suljevic.at/'
    },
    {
      title: 'Jonas Schwarz',
      subtitle: 'Android?!',
      image: '../../../../assets/images/Dashboard/Team/jonas.png',
      tag: '#design #map #ts',
      date: '2024-11-17',
      link: 'https://suljevic.at/'
    }
  ];

  backendCards = [
    {
      title: 'Adrian Zeitlberger',
      subtitle: 'Gewonnnnnnnen!!!',
      image: '../../../../assets/images/Dashboard/Team/adrian.jpg',
      tag: '#backend',
      date: '2024-11-17',
      link: 'https://suljevic.at/'
    },
    {
      title: 'Felix Ebertz',
      subtitle: 'databaseadmin',
      image: '../../../../assets/images/Dashboard/Team/ebertz.png',
      tag: '#databases',
      date: '2024-11-17',
      link: 'https://www.linkedin.com/in/felix-ebertz-95889832b/'
    }
  ];

  supervisorCards = [
    {
      title: 'Martin Höfermeyer, Msc',
      subtitle: 'Betreuer',
      image: '../../../../assets/images/Dashboard/Team/hoefermeyer2.jpg',
      tag: '#supervisor',
      date: '2024-11-17',
      link: 'https://suljevic.at/'
    }
  ];
}
