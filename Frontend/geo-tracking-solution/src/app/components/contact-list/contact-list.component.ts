import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {

  @Output() contactSelected = new EventEmitter<{ name: string; email: string }>();

  contacts = [
    { name: 'Kontakt 1', email: 'Beschreibung 1' },
    { name: 'Kontakt 2', email: 'Beschreibung 2' },
    { name: 'Kontakt 3', email: 'Beschreibung 3' },
    { name: 'Kontakt 4', email: 'Beschreibung 4' },
    { name: 'Kontakt 5', email: 'Beschreibung 5' }
  ];

  filteredContacts = [...this.contacts];  // Kopie der Kontakte für die Anzeige
  searchContact: string = '';

  // TODO: Noch zu bearbeiten
  filterContacts(): void {
    const lowerSearchText = this.searchContact.toLowerCase();

    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowerSearchText) ||
      contact.email.toLowerCase().includes(lowerSearchText)
    );
  }

  addNewContact(contact: { name: string; email: string }): void {
    this.contacts.push({ name: contact.name, email: contact.email });
    this.filteredContacts = [...this.contacts];
  }

  selectContact(contact: { name: string; email: string }): void {
    console.log('Selected Contact: ', contact)
    this.contactSelected.emit(contact);
  }
}
