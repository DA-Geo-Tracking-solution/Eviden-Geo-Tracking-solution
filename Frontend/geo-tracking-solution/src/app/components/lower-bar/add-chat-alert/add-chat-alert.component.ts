import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-chat-alert',
  templateUrl: './add-chat-alert.component.html',
  styleUrl: './add-chat-alert.component.css'
})
export class AddChatAlertComponent {

  contacts = [
    { name: 'Bob Boblio', email: 'bobo@lio.com' },
    { name: 'Alice Wonderland', email: 'alice@wonder.com' },
    { name: 'Max Mustermann', email: 'mustermann@max.com' }
  ];

  filteredContacts = this.contacts;
  serchTerm = ''; //Suchtext

  @Output() contactSelected = new EventEmitter<{ name: string; email: string }>();

  constructor(public matDialogRef: MatDialogRef<AddChatAlertComponent>) { }

  closeDialog() {
    this.matDialogRef.close();
  }

  selectContact(contact: { name: string; email: string }) {
    console.log(contact);
    this.contactSelected.emit(contact);
    this.closeDialog();
  }

  filterContacts(){
    const term = this.serchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact => 
      contact.name.toLowerCase().includes(term) || contact.email.toLowerCase().includes(term)
    );
  }

}
