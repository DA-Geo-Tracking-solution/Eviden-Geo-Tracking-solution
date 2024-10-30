import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  // TODO: Noch passendes Background Image für light/dark mode finden
  backgroundImage: string = '';
  private themeSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme.subscribe((theme: string) => {
      this.updateBackgroundImage(theme);
    });
  }

  updateBackgroundImage(theme: string) {
    if (theme === 'dark') {
      this.backgroundImage = '../../../assets/background/BI-1-DEEP_BLUE_CLOSE_UP_2.jpg';
    } else {
      this.backgroundImage = '../../../assets/background/BI-1-ORANGE_CLOSE_UP_2.jpg';
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
