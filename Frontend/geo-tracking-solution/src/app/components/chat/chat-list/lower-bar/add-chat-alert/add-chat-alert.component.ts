import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../../../../../services/REST/rest.service';
import { Chat, Contact } from '../../../../../models/interfaces';
import { ThemeService } from '../../../../../services/Theme/theme.service';

@Component({
  selector: 'app-add-chat-alert',
  templateUrl: './add-chat-alert.component.html',
  styleUrls: ['./add-chat-alert.component.css']
})
export class AddChatAlertComponent implements OnInit {

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContacts: Contact[] = [];

  chatName: string = '';
  serchTerm: string = '';
  currentTheme: string = '';

  @Output() chatCreated = new EventEmitter<Chat>();

  constructor(public matDialogRef: MatDialogRef<AddChatAlertComponent>, private restService: RestService, private themeService: ThemeService) { }

  ngOnInit() {
    this.restService.GET("member/group-members").then(observable => {
      observable.subscribe({
        next: (users) => {
          this.contacts = users.map((user: any) => ({
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            chatId: user.chatId,
          }));
          this.filteredContacts = [...this.contacts];
        },
        error: (err) => console.error("Error fetching contacts:", err),
      });
    });

    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });

  }

  closeDialog() {
    this.matDialogRef.close();
  }

  filterContacts(term: string) {
    const search = term.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(search) || contact.email.toLowerCase().includes(search)
    );
  }

  addContact(contact: Contact) {
    if (!this.selectedContacts.includes(contact)) {
      this.selectedContacts.push(contact);
    }
  }

  removeContact(contact: Contact) {
    this.selectedContacts = this.selectedContacts.filter(c => c !== contact);
  }

  createChat() {
    if (this.chatName && this.selectedContacts.length > 0) {
      const newChat: Chat = {
        chatName: this.chatName,
        chatId: Date.now().toString(), // Temporär generierte ID
        users: this.selectedContacts,
      };
      console.log(newChat);
      this.chatCreated.emit(newChat);
      this.closeDialog();
    }
  }
}
