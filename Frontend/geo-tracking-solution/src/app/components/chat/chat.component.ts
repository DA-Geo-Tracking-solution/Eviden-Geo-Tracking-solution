import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';
import { Chat } from '../../models/interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  //
  selectedChat: Chat = { chatId: '', chatName: '', users: []};
  currentTheme: string = '';

  constructor(private themeService: ThemeService) { }

  onChatSelected(chat: Chat) {
    this.selectedChat = chat;
  }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

}
