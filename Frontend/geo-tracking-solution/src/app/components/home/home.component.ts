import { Component } from '@angular/core';
import { RestService } from '../../services/REST/rest.service';
import { ThemeService } from '../../services/Theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  data: any;
  errorMsg: string | undefined;
  currentTheme: string = '';

  constructor(private themeService: ThemeService, private restService: RestService) { }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

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
