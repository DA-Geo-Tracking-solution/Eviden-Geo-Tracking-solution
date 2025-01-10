import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import { CookieSettingsService } from '../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/Theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  activeTab: string = 'user';

  backgroundImage: string = '';

  private themeSubscription: Subscription | undefined;

  // * Icons
  faUser = faUser;

  constructor(private router: Router, private cookieService: CookieSettingsService, private translateService: TranslateService,  private themeService: ThemeService) {
    this.translateService.use(this.cookieService.getLanguage());
   }

   ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme.subscribe((theme: string) => {
      this.updateBackgroundImage(theme);
    });
  }

  setActiveTab(tab: string){
    this.activeTab = tab;
  }

  isActiveTab(tab: string): boolean{
    return this.activeTab == tab;
  }

  updateBackgroundImage(theme: string) {
    if (theme === 'dark') {
      this.backgroundImage = '../../../assets/background/BI-2-DEEP_BLUE_CLOSE_UP_2.jpg';
    } else if (theme === 'light') {
      this.backgroundImage = '../../../assets/background/BI-2-ORANGE_CLOSE_UP_2.jpg';
    } else {
      // Optional: Default oder systemabhängige Logik
      this.backgroundImage = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? '../../../assets/background/BI-2-DEEP_BLUE_CLOSE_UP_2.jpg'
        : '../../../assets/background/BI-2-ORANGE_CLOSE_UP_2.jpg';
    }
  }
}
