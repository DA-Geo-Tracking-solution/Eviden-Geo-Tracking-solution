import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-costum-error-message',
  templateUrl: './costum-error-message.component.html',
  styleUrl: './costum-error-message.component.css'
})
export class CostumErrorMessageComponent {

  constructor(public dialogRef: MatDialogRef<CostumErrorMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string
    }) { }

    close(): void {
      this.dialogRef.close();
    }

}
