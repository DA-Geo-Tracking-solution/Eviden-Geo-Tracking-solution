import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})

export class NavigationBarComponent {
  @ViewChild('navbar') navbar!: ElementRef;

  // Variablen für die Icon-Pfade
  dashboardIcon: string = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
  groupsIcon: string = '../../../assets/icons/navigation-bar/black/groupe_black.png';
  contactIcon: string = '../../../assets/icons/navigation-bar/black/contact_black.png';
  mapIcon: string = '../../../assets/icons/navigation-bar/black/map_black.png';

  constructor(private renderer: Renderer2) { }

  // Funktion zum Ändern des Themes
  changeTheme(theme: string) {
    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', theme);
    console.log(`Theme changed to: ${theme}`);

    if (theme === 'dark') {
      this.dashboardIcon = '../../../assets/icons/navigation-bar/white/dashboard_white.png';
      this.groupsIcon = '../../../assets/icons/navigation-bar/white/groupe_white.png';
      this.contactIcon = '../../../assets/icons/navigation-bar/white/contact_white.png';
      this.mapIcon = '../../../assets/icons/navigation-bar/white/map_white.png';
    } else if (theme === 'light') {
      this.dashboardIcon = '../../../assets/icons/navigation-bar/black/dashboard_black.png';
      this.groupsIcon = '../../../assets/icons/navigation-bar/black/groupe_black.png';
      this.contactIcon = '../../../assets/icons/navigation-bar/black/contact_black.png';
      this.mapIcon = '../../../assets/icons/navigation-bar/black/map_black.png';
    }
  }
}
