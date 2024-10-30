import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  @ViewChild('navbar') navbar!: ElementRef;

  dashboardIcon: string = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
  createUserIcon: string = '../../../assets/icons/navigation-bar/black/user_black.png';
  chatIcon: string = '../../../assets/icons/navigation-bar/black/chat_black.png';
  mapIcon: string = '../../../assets/icons/navigation-bar/black/map_black.png';
  moreIcon: string = '../../../assets/icons/menue_black.png';
  evidenLogo: string = '../../../assets/Logo/Eviden_Black.png';

  themeIcon: string = '../../../assets/icons/theme/monitor.png';

  currentTheme: string = 'system';

  // Neue Variable zum Steuern des Burger-Menüs
  navbarOpen: boolean = false;

  constructor(private renderer: Renderer2, private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.currentTheme.subscribe(theme => {
      this.currentTheme = theme;
      this.updateThemeIcons(theme); // Passe das Icon basierend auf dem Theme an
      this.applyTheme(theme);  // Wende das Theme in der UI an
    });

  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  updateThemeIcons(theme: string) {
    if (theme === 'dark') {
      this.themeIcon = '../../../assets/icons/theme/dark.png';
      this.updateIconsForDarkTheme();

    } else if (theme === 'light') {
      this.themeIcon = '../../../assets/icons/theme/sonne.png';
      this.updateIconsForLightTheme();
      
    } else {
      this.themeIcon = '../../../assets/icons/theme/monitor.png';
      this.applySystemTheme();
    }
  }

  applyTheme(theme: string) {
    if (theme === 'dark') {
      this.applyDarkTheme();
    } else if (theme === 'light') {
      this.applyLightTheme();
    } else {
      this.applySystemTheme();
    }
  }

  applyDarkTheme() {

    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', 'dark');
    this.renderer.removeClass(this.navbar.nativeElement, 'navbar-light');
    this.renderer.addClass(this.navbar.nativeElement, 'navbar-dark');

    // ! Brauch ich das????
    this.renderer.setStyle(this.navbar.nativeElement, 'color', 'white');

    this.updateIconsForDarkTheme();
  }

  applyLightTheme() {

    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', 'light');
    this.renderer.removeClass(this.navbar.nativeElement, 'navbar-dark');
    this.renderer.addClass(this.navbar.nativeElement, 'navbar-light');

    // ! Brauch ich das???
    this.renderer.setStyle(this.navbar.nativeElement, 'color', 'black');

    this.updateIconsForLightTheme();
  }

  updateIconsForDarkTheme() {
    this.dashboardIcon = '../../../assets/icons/navigation-bar/white/dashboard_white.png';
    this.createUserIcon = '../../../assets/icons/navigation-bar/white/user_white.png';
    this.chatIcon = '../../../assets/icons/navigation-bar/white/chat_white.png';
    this.mapIcon = '../../../assets/icons/navigation-bar/white/map_white.png';
    this.moreIcon = '../../../assets/icons/menue_white.png';
    this.evidenLogo = '../../../assets/Logo/Eviden_White.png';
  }

  updateIconsForLightTheme() {
    this.dashboardIcon = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
    this.createUserIcon = '../../../assets/icons/navigation-bar/black/user_black.png';
    this.chatIcon = '../../../assets/icons/navigation-bar/black/chat_black.png';
    this.mapIcon = '../../../assets/icons/navigation-bar/black/map_black.png';
    this.moreIcon = '../../../assets/icons/menue_black.png';
    this.evidenLogo = '../../../assets/Logo/Eviden_Black.png';
  }

  applySystemTheme() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  }

  // Neue Methode zum Umschalten des Burger-Menüs
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
