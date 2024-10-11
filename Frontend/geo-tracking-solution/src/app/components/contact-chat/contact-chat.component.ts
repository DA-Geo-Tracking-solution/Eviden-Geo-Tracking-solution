import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-contact-chat',
  templateUrl: './contact-chat.component.html',
  styleUrls: ['./contact-chat.component.css'] // Korrigiere hier 'styleUrl' zu 'styleUrls'
})
export class ContactChatComponent implements OnInit {
  @Input() contact!: { name: string; description: string };

  public messages: string[] = [];
  public message: string = '';
  public navbarOpen: boolean = false;  // Burger-Menü Zustand

  constructor(private webService: WebsocketService) { }

  ngOnInit(): void {
    // WebSocket-Verbindung erstellen
    this.webService.connect('').subscribe(event => {
      const data = JSON.parse(event.data);
      this.messages.push(data.message);
    });
  }

  // Nachricht senden
  sendMessage(): void {
    if (this.message) {
      this.webService.send({ message: this.message });
      this.message = '';
    }
  }

  // Burger-Menü Umschalten
  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
