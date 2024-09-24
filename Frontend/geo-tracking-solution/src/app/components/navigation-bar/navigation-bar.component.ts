import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})

export class NavigationBarComponent {
  @ViewChild('navbar') navbar!: ElementRef;

  constructor(private renderer: Renderer2) { }

  // Funktion zum Ändern des Themes
  changeTheme(theme: string) {
    this.renderer.setAttribute(this.navbar.nativeElement, 'data-theme', theme);
    console.log(`Theme changed to: ${theme}`);
  }
}
