import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('system');
  currentTheme = this.themeSubject.asObservable();

  constructor() { }

  setTheme(theme: string) {
    this.themeSubject.next(theme);
    if (theme === 'system') {
      this.applySystemTheme();
    }
  }

  private applySystemTheme() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.themeSubject.next(isDarkMode ? 'dark' : 'light');
  }
}
