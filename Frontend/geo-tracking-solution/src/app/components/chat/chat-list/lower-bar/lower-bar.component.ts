import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChatAlertComponent } from './add-chat-alert/add-chat-alert.component';
import { subscribe } from 'node:diagnostics_channel';
import { Chat } from '../../../../models/interfaces';
import { CookieSettingsService } from '../../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lower-bar',
  templateUrl: './lower-bar.component.html',
  styleUrl: './lower-bar.component.css'
})
export class LowerBarComponent {

  isAlertVisibel = false;
  @Output() chatAdded = new EventEmitter<Chat>();
  currentTheme = '';

  constructor(public matDialog: MatDialog, private cookieServer: CookieSettingsService, private translateService: TranslateService) { 
    this.translateService.use(this.cookieServer.getLanguage());
  }

  openDialog() {
    //  * https://v6.material.angular.io/components/dialog/overview
    const dialogRef = this.matDialog.open(AddChatAlertComponent, {
      width: '50%',
    });

    dialogRef.componentInstance.chatCreated.subscribe((chat: Chat) => {
      this.chatAdded.emit(chat);
    });
  }

  showAlert() {
    this.isAlertVisibel = true;
  }
}
