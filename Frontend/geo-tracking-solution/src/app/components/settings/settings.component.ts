import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import { CookieSettingsService } from '../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  activeTab: string = 'user';

  // * Icons
  faUser = faUser;

  constructor(private router: Router, private cookieService: CookieSettingsService, private translateService: TranslateService) {
    this.translateService.use(this.cookieService.getLanguage());
   }

  setActiveTab(tab: string){
    this.activeTab = tab;
  }

  isActiveTab(tab: string): boolean{
    return this.activeTab == tab;
  }

}
