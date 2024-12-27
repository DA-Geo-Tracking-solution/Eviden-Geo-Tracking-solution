import { Component } from '@angular/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.css'
})
export class ChangeLanguageComponent {

  languages = ['en', 'de', 'fr', 'es', 'it', 'bih', "tur"];
  selectedLanguage: string;
  pendingLanguage: string;

  constructor(private cookieService: CookieSettingsService, private translateService: TranslateService) {
    this.selectedLanguage = this.cookieService.getLanguage();
    this.pendingLanguage = this.selectedLanguage;

    this.translateService.use(this.selectedLanguage);
  }

  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target && target.value) {
      this.pendingLanguage = target.value;
    }
  }

  submitChanges(): void {
    if (this.pendingLanguage && this.pendingLanguage !== this.selectedLanguage) {

      this.cookieService.setLanguage(this.pendingLanguage);
      this.translateService.use(this.pendingLanguage);
      this.selectedLanguage = this.pendingLanguage;

     // alert(`Language changed to: ${this.pendingLanguage.toUpperCase()}`);

    }else{
      alert('No changes detected');
    }
  }
}
