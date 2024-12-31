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
      description: 'Open the chat to communicate with your teammembers.',
      image: '../../../../assets/images/chatplatzhalter.png'
    },
    {
      title: 'Map',
      description: 'See the position of all groupmembers to have a better overview and be able to manage them.',
      image: '../../../../assets/images/chatplatzhalter.png'
    },
    {
      title: 'Create User/Group',
      description: 'Create new users or groups whenever you need to.',
      image: '../../../../assets/images/chatplatzhalter.png'
    },
    {
      title: 'Settings',
      description: 'Personalize your workspace to your own taste!',
      image: '../../../../assets/images/chatplatzhalter.png'
    }
  ];

}
