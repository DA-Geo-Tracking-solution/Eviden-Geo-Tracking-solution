import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {

  @Output() contactSelected = new EventEmitter<{ name: string; description: string }>();

  contacts = [
    { name: 'Kontakt 1', description: 'Beschreibung 1' },
    { name: 'Kontakt 2', description: 'Beschreibung 2' },
    { name: 'Kontakt 3', description: 'Beschreibung 3' },
    { name: 'Kontakt 4', description: 'Beschreibung 4' }
  ];

  selectContact(contact: { name: string; description: string }): void {
    console.log('Selected Contact: ', contact)
    this.contactSelected.emit(contact);
  }
}
