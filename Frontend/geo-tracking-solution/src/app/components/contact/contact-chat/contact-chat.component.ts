import { Component, OnInit, Input } from '@angular/core';
import { ServerDataService } from '../../../services/server-data/server-data.service';
import { RestService } from '../../../services/REST/rest.service';

export interface ChatMessage {
  timestamp: number,
  sender: string,
  content: string,
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
  private chatId: number = 0; // 0 = Global Chat?

  constructor(private restService: RestService, private serverDataService: ServerDataService) { }

  ngOnInit(): void {
    this.serverDataService.getChatMessage(this.chatId, (data: any) => {
      console.log(data);
      if (data.sender && data.content && data.timestamp) {
        this.messages.push(data);
      }
    });
  }

  // Nachricht senden
  sendMessage(): void {
    if (this.message.trim()) {
      this.restService.POST(`member/chat/${this.chatId}`, this.message).then(observable => {
        observable.subscribe({
            next: (line) => {
             console.log(line)
            },
            error: (err) => {
              console.error("Error in Observable:", err);
            },
            complete: () => {
              console.log("Observable completed");
            },
          });
        }).catch(err => {
            console.error("Error resolving promise:", err);
        });
      this.message = '';  // Eingabefeld nach dem Senden leeren
    }
  }

  // Burger-Menü Umschalten
  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
