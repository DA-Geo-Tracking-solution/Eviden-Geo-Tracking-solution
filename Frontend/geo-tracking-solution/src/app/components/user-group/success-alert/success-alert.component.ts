import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrl: './success-alert.component.css'
})
export class SuccessAlertComponent {

constructor(public matDialogRef: MatDialogRef<SuccessAlertComponent>) { }

  closeDialog() {
    this.matDialogRef.close();
  }

}
