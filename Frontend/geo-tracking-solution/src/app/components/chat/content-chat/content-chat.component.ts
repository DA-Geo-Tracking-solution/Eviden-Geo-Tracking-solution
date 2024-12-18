import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ServerDataService } from '../../../services/server-data/server-data.service';
import { RestService } from '../../../services/REST/rest.service';
import { ChatMessage, Chat } from '../../../models/interfaces';


@Component({
  selector: 'app-content-chat',
  templateUrl: './content-chat.component.html',
  styleUrls: ['./content-chat.component.css']
})
export class ContentChatComponent implements OnChanges {
  @Input() chat!: Chat;
  @Input() currentTheme!: string;

  public messages: ChatMessage[] = [];
  public message: string = '';
  public navbarOpen: boolean = false;  // Burger-Menü Zustand

  constructor(private restService: RestService, private serverDataService: ServerDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat']) {
      this.messages = [];
      this.serverDataService.getChatMessage(this.chat.chatId, (data: any) => {
        console.log(data);
        if (data.sender && data.content && data.timestamp) {
          this.messages.push(data);
        }
      });
    }
  }

  // TODO: Websockets müssen geschlossen werden, da Nachrichten mehrmals am Stück gesendet werden

  // Nachricht senden
  sendMessage(): void {
    if (this.message.trim()) {
      this.restService.POST(`member/chat/${this.chat.chatId}`, this.message).then(observable => {
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
