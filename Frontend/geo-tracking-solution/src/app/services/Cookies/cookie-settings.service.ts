import { Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieSettingsService {

  private readonly themeKey = 'theme';
  private readonly languageKey = 'language';

  constructor(private cookieService: CookieService) { }

  setTheme(theme: string){
    this.cookieService.set(this.themeKey, theme, 30); // 30 Tage gültig
  }
   
  getTheme(){
    return this.cookieService.get(this.themeKey) || 'system';
  }

  setLanguage(language: string){
    this.cookieService.set(this.languageKey, language, 30); // 30 Tage gültig
  }

  getLanguage(): string {
    return this.cookieService.get(this.languageKey) || 'en'; // Standard auf Englisch
  }

}
