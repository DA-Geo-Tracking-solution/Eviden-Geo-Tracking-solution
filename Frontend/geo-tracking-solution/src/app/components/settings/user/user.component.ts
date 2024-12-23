import { Component } from '@angular/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../services/Theme/theme.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

constructor(private cookieService: CookieSettingsService, private translateService: TranslateService, private themeService: ThemeService) {
    this.translateService.use(this.cookieService.getLanguage());
  }

}
