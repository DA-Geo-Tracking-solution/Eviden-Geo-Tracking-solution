import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RestService } from '../../../services/REST/rest.service';
import { Chat, Contact } from '../../../models/interfaces';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  @Output() chatSelected = new EventEmitter<Chat>();

  chats: Chat[] = [
    {
      chatId: '0',
      chatName: 'Chat 0',
      users: [
        { name: 'Kontakt 1', email: 'kontakt1@mail.com'},
        { name: 'Kontakt 3', email: 'kontakt3@mail.com'},
        { name: 'Kontakt 4', email: 'kontakt4@mail.com'},
        { name: 'Kontakt 5', email: 'kontakt5@mail.com'},
        { name: 'Kontakt 6', email: 'kontakt6@mail.com'}
      ]
    },
    {
      chatId: '1',
      chatName: 'Chat 1',
      users: [
        { name: 'Kontakt 1', email: 'kontakt1@mail.com'},
        { name: 'Kontakt 2', email: 'kontakt2@mail.com'}
      ]
    },
    {
      chatId: '2',
      chatName: 'Chat 2',
      users: [
        { name: 'Kontakt 3', email: 'kontakt3@mail.com' },
        { name: 'Kontakt 4', email: 'kontakt4@mail.com' },
        { name: 'Kontakt 5', email: 'kontakt5@mail.com' }
      ]
    }
  ];

  filteredChats: Chat[] = [...this.chats];
  searchContact: string = '';

  constructor(private restService: RestService) { }

  async ngOnInit() {
    (await this.restService.GET("member/chats")).subscribe({
      next: (chatData: any) => {
        for (const chat of chatData) {
          this.chats.push({
            chatId: chat.chatId,
            chatName: chat.chatName,
            users: chat.members.map((user: any) => ({
              name: `${user.firstname} ${user.lastname}`,
              email: user.email,
              chatId: user.chatId
            }))
          });
        }
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
    this.chats.push(chat);
    this.filteredChats = [...this.chats];
  }

  selectChat(chat: Chat): void {
    console.log('Selected Chat: ', chat);
    this.chatSelected.emit(chat);
  }
}
