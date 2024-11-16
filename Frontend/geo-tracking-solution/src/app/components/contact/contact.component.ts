import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  //
  selectedContact: { name: string; email: string } = { name: '', email: '' };
  currentTheme: string = '';
  constructor(private themeService: ThemeService) { }

  onContactSelected(contact: { name: string; email: string }) {
    this.selectedContact = contact;
  }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

}
