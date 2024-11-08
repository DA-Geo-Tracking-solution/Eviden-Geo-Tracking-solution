import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';
import { from, Subscription } from 'rxjs';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrl: './user-group.component.css'
})
export class UserGroupComponent {
  backgroundImage: string = '';
  private themeSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme.subscribe((theme: string) => {
      this.updateBackgroundImage(theme);
    });
  }

  updateBackgroundImage(theme: string) {
    if (theme === 'dark') {
      this.backgroundImage = '../../../assets/background/BI-1-DEEP_BLUE_CLOSE_UP_2.jpg';
    } else if (theme === 'light') {
      this.backgroundImage = '../../../assets/background/BI-1-ORANGE_CLOSE_UP_2.jpg';
    } else {
      // Optional: Default oder systemabhängige Logik
      this.backgroundImage = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? '../../../assets/background/BI-1-DEEP_BLUE_CLOSE_UP_2.jpg'
        : '../../../assets/background/BI-1-ORANGE_CLOSE_UP_2.jpg';
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

}

