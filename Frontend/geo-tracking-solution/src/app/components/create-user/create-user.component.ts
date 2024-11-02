import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';
import { from, Subscription } from 'rxjs';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  backgroundImage: string = '';
  private themeSubscription: Subscription | undefined;

  // * Icons:
  faEnvelope = faEnvelope;
  faUser = faUser;
  faExclamationTriangle = faExclamationTriangle;
  faKey = faKey;
  faCheck = faCheck;

  // * Form 
  form: FormGroup;

  constructor(private themeService: ThemeService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstname: [''], // Hinzugefügt
      lastname: [''], // Hinzugefügt
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]]
    }, { updateOn: 'change' });
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

  // Getter
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

}
