import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  @ViewChild('navbar') navbar!: ElementRef;

  dashboardIcon: string = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
  groupsIcon: string = '../../../assets/icons/navigation-bar/black/groupe_black.png';
  contactIcon: string = '../../../assets/icons/navigation-bar/black/contact_black.png';
  mapIcon: string = '../../../assets/icons/navigation-bar/black/map_black.png';
  moreIcon: string = '../../../assets/icons/menue_black.png';
  evidenLogo: string = '../../../assets/Logo/Eviden_Black.png';

  themeIcon: string = '../../../assets/icons/theme/monitor.png';

  currentTheme: string = 'system';

  // Neue Variable zum Steuern des Burger-Menüs
  navbarOpen: boolean = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.applySystemTheme();

      // Überwache Systemtheme
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }

  ngAfterViewInit() {
    // Theme erneut anwenden nach Initialisierung der Komponente
    this.applySystemTheme();
  }

  changeTheme(theme: string) {
    this.currentTheme = theme;
    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', theme);
    console.log(`Theme changed to: ${theme}`);

    if (theme === 'dark') {
      this.applyDarkTheme();
    } else if (theme === 'light') {
      this.applyLightTheme();
    } else if (theme === 'system') {
      this.applySystemTheme();
    }
  }

  applyDarkTheme() {
    this.dashboardIcon = '../../../assets/icons/navigation-bar/white/dashboard_white.png';
    this.groupsIcon = '../../../assets/icons/navigation-bar/white/groupe_white.png';
    this.contactIcon = '../../../assets/icons/navigation-bar/white/contact_white.png';
    this.mapIcon = '../../../assets/icons/navigation-bar/white/map_white.png';
    this.moreIcon = '../../../assets/icons/menue_white.png';
    this.evidenLogo = '../../../assets/Logo/Eviden_White.png';

    this.themeIcon = '../../../assets/icons/theme/dark.png';

    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', 'dark');
    this.renderer.removeClass(this.navbar.nativeElement, 'navbar-light');
    this.renderer.addClass(this.navbar.nativeElement, 'navbar-dark');

    this.renderer.setStyle(this.navbar.nativeElement, 'color', 'white');
  }

  applyLightTheme() {
    this.dashboardIcon = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
    this.groupsIcon = '../../../assets/icons/navigation-bar/black/groupe_black.png';
    this.contactIcon = '../../../assets/icons/navigation-bar/black/contact_black.png';
    this.mapIcon = '../../../assets/icons/navigation-bar/black/map_black.png';
    this.moreIcon = '../../../assets/icons/menue_black.png';
    this.evidenLogo = '../../../assets/Logo/Eviden_Black.png';

    this.themeIcon = '../../../assets/icons/theme/sonne.png';

    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', 'light');
    this.renderer.removeClass(this.navbar.nativeElement, 'navbar-dark');
    this.renderer.addClass(this.navbar.nativeElement, 'navbar-light');

    this.renderer.setStyle(this.navbar.nativeElement, 'color', 'black');
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
