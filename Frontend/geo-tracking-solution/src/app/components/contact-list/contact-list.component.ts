import { Component, EventEmitter, Output } from '@angular/core';
import { ScrollerModule } from 'primeng/scroller';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {

  // @Output() contactSelected = new EventEmitter<string>();

  // TODO: Muss später geändert werden zu den Kontakten in der Datenbank
  // contacts: string[] = ['Kontakt 1', 'Kontakt 2', 'Kontakt 3'];

  // selectContact(contact: string):void{
  //   this.contactSelected.emit(contact);
  // }

  items!: string[];

  ngOnInit() {
    this.items = Array.from({ length: 1000 }).map((_, i) => `Item #${i}`);
  }

}
