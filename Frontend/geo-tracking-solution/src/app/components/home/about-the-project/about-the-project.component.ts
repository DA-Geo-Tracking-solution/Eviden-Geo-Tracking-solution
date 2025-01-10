import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';

@Component({
  selector: 'app-about-the-project',
  templateUrl: './about-the-project.component.html',
  styleUrl: './about-the-project.component.css'
})
export class AboutTheProjectComponent {

  constructor(private cookieService: CookieSettingsService, private translateService: TranslateService) {
    this.translateService.use(this.cookieService.getLanguage());
    
  }

}
