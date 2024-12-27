import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RestService } from '../../../services/REST/rest.service';
import { Chat, Contact } from '../../../models/interfaces';
import { MessageService } from '../../../services/message/message.service';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  @Output() chatSelected = new EventEmitter<Chat>();

  chats: Chat[] = [];

  filteredChats: Chat[] = [...this.chats];
  searchContact: string = '';


  constructor(private restService: RestService, private cookieSettingsService: CookieSettingsService, private translateService: TranslateService, private messageService: MessageService) { 
    this.translateService.use(this.cookieSettingsService.getLanguage());

  }


  async ngOnInit() {
    (await this.restService.GET("member/chats")).subscribe({
      next: (chatData: any) => {
        for (const chat of chatData) {
          this.chats.push({
            chatId: chat.chatId,
            chatName: chat.chatName,
            users: chat.members.map((user: any) => ({
              name: `${user.firstname} ${user.lastname}`,
              email: user.email
            }))
          });
        }
        this.messageService.init(this.chats);
        this.filteredChats = [...this.chats];
      },
      error: (e) => console.error('Error fetching chats', e),
      complete: () => console.info('Complete fetching chats')
    });
  }

  filterChats(): void {
    console.log("filtering chats...");
    const lowerSearchText = this.searchContact.toLowerCase();

    this.filteredChats = this.chats.filter(chat =>
      chat.chatName.toLowerCase().includes(lowerSearchText) || chat.users.some(user =>
        user.name.toLowerCase().includes(lowerSearchText) || user.email.toLowerCase().includes(lowerSearchText))
    );
  }

  addNewChat(chat: Chat): void {
    for (const user of chat.users) {
      console.log(user.email);
    }

    const body = {
      "chatName": chat.chatName,
      "userEmails": chat.users.map(user => user.email)
    };

    this.restService.POST("member/chat", body).then(observable => {
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
  }

  selectChat(chat: Chat): void {
    console.log('Selected Chat: ', chat);
    this.chatSelected.emit(chat);
  }
}
