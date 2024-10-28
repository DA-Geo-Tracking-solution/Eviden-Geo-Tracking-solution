import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  selectedContact: { name: string; email: string } = { name: 'Bob', email: 'Das ist Boblio' };

  onContactSelected(contact: { name: string; email: string }) {
    this.selectedContact = contact;
  }

}
