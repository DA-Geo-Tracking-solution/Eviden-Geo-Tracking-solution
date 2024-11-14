import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChatAlertComponent } from './add-chat-alert/add-chat-alert.component';
import { subscribe } from 'node:diagnostics_channel';

@Component({
  selector: 'app-lower-bar',
  templateUrl: './lower-bar.component.html',
  styleUrl: './lower-bar.component.css'
})
export class LowerBarComponent {

  isAlertVisibel = false;
  @Output() contactAdded = new EventEmitter<{ name: string, email: string }>();

  constructor(public matDialog: MatDialog) { }

  openDialog() {
    //  * https://v6.material.angular.io/components/dialog/overview
    const dialogRef = this.matDialog.open(AddChatAlertComponent, {
      width: '50%',
    });

    dialogRef.componentInstance.contactSelected.subscribe((contact: { name: string; email: string }) => {
      this.contactAdded.emit(contact);
    });
  }

  showAlert() {
    this.isAlertVisibel = true;
  }



}
