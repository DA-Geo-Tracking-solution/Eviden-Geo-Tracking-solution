import { Component } from '@angular/core';
import { RestService } from '../../services/REST/rest.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  data: any;
  errorMsg: string | undefined;

  constructor(private restService: RestService) { }

  onButtonClick() {
    this.restService.getData().subscribe({
      next: (response) => {
        this.data = response;
        this.errorMsg = undefined;
        console.log('Unsere Daten:' , this.data);
      },
      error: (error) => {
        this.errorMsg = error;
        console.error('Unser Fehler: ', this.errorMsg);
      }
    });
  }

}
