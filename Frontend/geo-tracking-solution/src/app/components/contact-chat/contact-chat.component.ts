import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-contact-chat',
  templateUrl: './contact-chat.component.html',
  styleUrl: './contact-chat.component.css'
})
export class ContactChatComponent implements OnInit {

  public messages: string[] = [];
  public message: string = '';

  constructor(private webService: WebsocketService) { }

  ngOnInit(): void {
    // Verbindung erstellen
    this.webService.connect('').subscribe(event => {
      const data = JSON.parse(event.data);
      this.messages.push(data.message);
    });
  }

  // Nachtichten senden können
  sendMessage(): void {
    if (this.message) {
      this.webService.send({ message: this.message });
      this.message = '';
    }
  }
}
