import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieSettingsService } from '../Cookies/cookie-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.cookieService.getTheme());
  currentTheme = this.themeSubject.asObservable();

  constructor(private cookieService: CookieSettingsService) { }

  setTheme(theme: string) {
    this.themeSubject.next(theme);
    this.cookieService.setTheme(theme);
    if (theme === 'system') {
      this.applySystemTheme();
    }
  }

  private applySystemTheme() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = isDarkMode ? 'dark' : 'light';
    this.themeSubject.next(systemTheme);
    this.cookieService.setTheme(systemTheme);
  }
}
