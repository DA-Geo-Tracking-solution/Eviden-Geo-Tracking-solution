import { Component } from '@angular/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../services/Theme/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RestService } from '../../../services/REST/rest.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

form: FormGroup;

constructor(private cookieService: CookieSettingsService, private translateService: TranslateService, private themeService: ThemeService, private formBuilder: FormBuilder, private restService: RestService) {
    this.translateService.use(this.cookieService.getLanguage());

    this.form = this.formBuilder.group({
      firstname: [''], // Hinzugefügt
      lastname: [''], // Hinzugefügt
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]]
    }, { updateOn: 'change' });

  }

  getUser(){
    
  }
  
}
