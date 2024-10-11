import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  selectedContact: { name: string; description: string } = { name: 'Bob', description: 'Das ist Boblio' };

  onContactSelected(contact: { name: string; description: string }) {
    this.selectedContact = contact;
  }

}
