import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @ViewChild('footer') footer!: ElementRef;

  currentTheme: string = 'light'; // Standardwert

  constructor(private renderer: Renderer2, private themeService: ThemeService) { }

  ngOnInit() {
    // Abonnieren des aktuellen Themas vom ThemeService
    this.themeService.currentTheme.subscribe(theme => {
      this.currentTheme = theme; // Speichern des aktuellen Themas
      this.applyTheme(theme); // Anwenden des Themas
    });
  }

  applyTheme(theme: string) {
    if (theme === 'dark') {
      this.renderer.setAttribute(this.footer.nativeElement, 'data-theme', 'dark');
      this.renderer.setStyle(this.footer.nativeElement, 'background-color', '#002d3c');
      this.renderer.setStyle(this.footer.nativeElement, 'color', 'white');
    } else {
      this.renderer.setAttribute(this.footer.nativeElement, 'data-theme', 'light');
      this.renderer.setStyle(this.footer.nativeElement, 'background-color', '#ff6d43');
      this.renderer.setStyle(this.footer.nativeElement, 'color', 'black');
    }
  }
}
