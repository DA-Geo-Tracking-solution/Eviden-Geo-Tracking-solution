import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';

export interface ChatMessage {
  timestamp: number,
  author: string,
  message: string,
  chatId: number
}

@Component({
  selector: 'app-contact-chat',
  templateUrl: './contact-chat.component.html',
  styleUrls: ['./contact-chat.component.css']
})
export class ContactChatComponent implements OnInit {
  @Input() contact!: { name: string; email: string };
  @Input() currentTheme!: string;

  public messages: ChatMessage[] = [];
  public message: string = '';
  public navbarOpen: boolean = false;  // Burger-Menü Zustand

  constructor(private webService: WebsocketService) { }

  ngOnInit(): void {
    // Testdaten
    this.messages = [
      {
        timestamp: Date.now(),
        author: 'Test User 1',
        message: 'Hallo! Wie geht es dir?',
        chatId: 1
      },
      {
        timestamp: Date.now(),
        author: 'Test User 2',
        message: 'Mir geht es gut, danke! Und dir?',
        chatId: 1
      },
      {
        timestamp: Date.now(),
        author: 'Test User 1',
        message: 'Auch gut! Was machst du gerade?',
        chatId: 1
      },
      { timestamp: Date.now(), 
        author: 'Ich', 
        message: 'Noch eine längere Nachricht, die zeigt, wie Zeilenumbruch funktioniert, wenn der Text besonders lang ist und somit über die max-Breite hinausgeht.', 
        chatId: 1 
      }
    ];

    this.webService.connect('').subscribe((data: any) => {
      if (data.timestamp && data.author && data.message && data.chatid) {
        this.messages.push(data);
      }
    });
  }

  // Nachricht senden
  sendMessage(): void {
    if (this.message.trim()) {  // Nachricht nur senden, wenn das Eingabefeld nicht leer ist
      const chatMessage: ChatMessage = {
        timestamp: Date.now(),
        author: 'Ich',  // Beispiel: Benutzername kann hier dynamisch sein
        message: this.message.trim(),
        chatId: 1
      };
      this.messages.push(chatMessage);  // Die Nachricht wird ins Nachrichtenarray gepusht
      this.webService.send(chatMessage);  // Nachricht über WebSocket senden
      // ! Das geht nicht
      this.message = '';  // Eingabefeld nach dem Senden leeren
    }
  }

  // Burger-Menü Umschalten
  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
