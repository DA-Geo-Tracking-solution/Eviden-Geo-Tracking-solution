import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.detectColorScheme();
  }

  detectColorScheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDarkScheme) {
      this.renderer.setAttribute(document.body, 'data-theme', 'dark');
    } else {
      this.renderer.setAttribute(document.body, 'data-theme', 'light');
    }

    // Listener für Änderungen des Farbschemas
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      this.renderer.setAttribute(document.body, 'data-theme', newColorScheme);
    });
  }
}
