import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../../../../../services/REST/rest.service';
import { first } from 'rxjs';
import { ThemeService } from '../../../../../services/Theme/theme.service';

interface Contact {
  name: string;
  email: string;
};

@Component({
  selector: 'app-add-chat-alert',
  templateUrl: './add-chat-alert.component.html',
  styleUrl: './add-chat-alert.component.css'
})
export class AddChatAlertComponent implements OnInit{
  
  contacts: Contact[] = [];
  
  filteredContacts: Contact[] = [];
  serchTerm = ''; //Suchtext
  currentTheme = '';

  @Output() contactSelected = new EventEmitter<{ name: string; email: string }>();

  constructor(public matDialogRef: MatDialogRef<AddChatAlertComponent>, private restService: RestService, private themeService:ThemeService) { }
  
  ngOnInit() {
    console.log(this.restService.GET("member/group-members"))
    this.restService.GET("member/group-members").then(observable => {
      observable.subscribe({
          next: (users) => {
            this.contacts = [];
            for (const user of users) {
              this.contacts.push({
                name: `${user["firstname"]} ${user["lastname"]}`,
                email: user["email"]
              });
            }
            this.filteredContacts = this.contacts;
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

      this.themeService.currentTheme.subscribe((theme) => {
        this.currentTheme = theme;
      });

      }

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
