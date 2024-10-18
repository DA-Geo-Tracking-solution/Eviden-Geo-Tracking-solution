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
    this.restService.GET("member/hello").then((response) => {
      response.subscribe(
        (data) => {
          this.data = data;
        },
        (error) => {
          console.error('Error fetching secure data', error);
        }
      );
    });
  }

}
