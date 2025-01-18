import { Injectable } from '@angular/core';
import { CostumErrorMessageComponent } from '../../components/costum-error-message/costum-error-message.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(private dialog: MatDialog) { }

  openErrorDialog(title: string, message: string): void {
    this.dialog.open(CostumErrorMessageComponent, {
      width: '400px',
      data: { title, message }
    });
  }

}
